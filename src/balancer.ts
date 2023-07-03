import cluster from 'cluster';
import os from 'os';
import http, { IncomingMessage, ServerResponse, createServer } from 'http';

import { startServer } from './main';
import config from './config';
import User from './DataBase/UserEntity';
import { UserDB } from './DataBase/UserDB';

type Message = {
    reason: string;
    users: User[];
}

const { PORT } = config;
const userDB = UserDB.getInstance();

function sendMessageToWorkers(message: Message) {
    for (const worker of Object.values(cluster.workers || {})) {
        if (worker) {
            worker.send(message);
        }
    }
}

function runBalancerServer() {
    let workerIndex = 0;

    createServer((client_req: IncomingMessage, client_res: ServerResponse) => {
        workerIndex = workerIndex === os.cpus().length ? 1 : ++workerIndex;

        const options = {
            host: 'localhost',
            port: +PORT + workerIndex,
            path: client_req.url,
            method: client_req.method,
            headers: client_req.headers,
        } as http.RequestOptions;

        const proxy = http.request(
            options,
            function (res: IncomingMessage) {
                client_res.writeHead(res.statusCode as number, res.headers);
                res.pipe(client_res, { end: true });
            }
        );

        client_req.pipe(proxy, {
            end: true,
        });

        client_res.once('finish', () => {
            getUsersFromCurrentWorker(workerIndex).then((users: User[]) => {
                sendMessageToWorkers({
                    reason: 'syncData',
                    users,
                });
            }).catch((err) => {
                console.log(err);
            });

        });
    }).listen(PORT, () => {
        console.log(`Main server is listening on port ${PORT}`);
    });
}

function getUsersFromCurrentWorker(workerIndex: number): Promise<User[]> {
    const currentWorker = (cluster.workers || {})[workerIndex];

    if (currentWorker) {
        const promise = new Promise((res) => {
            currentWorker.once('message', (message: Message) => {
                if (message.reason === 'updatedUsers') {
                    res(message.users);
                }
            });
        });

        currentWorker.send({ reason: 'getUsers' });

        return promise as Promise<User[]>;
    } else {
        return Promise.resolve([]);
    }
}

function runWorkers() {
    os.cpus().forEach((cpu, i) => {
        cluster.fork({ PORT: +PORT + i + 1 });
    });
}

function subscribeOnMessagesFromMainProcess() {
    process.on('message', (message: Message) => {
        if (message.reason === 'syncData') {
            userDB.synchronizeDB(message.users);
        }

        if (message.reason === 'getUsers') {
            process.send?.({
                reason: 'updatedUsers',
                users: userDB.getAll(),
            });
        }
    });
}

async function startBalancer() {
    if (cluster.isPrimary) {
        runWorkers()
        runBalancerServer();
    } else {
        subscribeOnMessagesFromMainProcess();
        await startServer();
    }
}

startBalancer().then(() => {
    console.log('The balancer is up and running');
}).catch((err) => {
    console.log('The balancer wasn\'t started. An error occurred: ', err);
});