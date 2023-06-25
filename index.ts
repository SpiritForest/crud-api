import { IncomingMessage, ServerResponse } from 'http'
import * as http from 'http';
import config from './config';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    res.end();
});

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(config.PORT, () => {
    console.log(`Server is running on port: ${config.PORT}`);
});