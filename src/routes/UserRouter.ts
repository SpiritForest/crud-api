import { ServerResponse } from 'http';
import { validate as uuidv4Validate } from 'uuid';

import { ExtendedIncomingMessage, IUser } from '../types/HTTPServerTypes';
import Router from "../Router/Router";
import { UserDB } from '../DataBase/UserDB';
import User from '../DataBase/UserEntity';

const validateUserBody = (body: IUser) => {
    let isValid = true;

    if (!body.username || typeof body.username !== "string") {
        isValid = false;
    } else if (!body.age || typeof body.age !== "number") {
        isValid = false;
    } else if (!body.hobbies || !Array.isArray(body.hobbies) || body.hobbies.some((hobby) => typeof hobby !== "string")) {
        isValid = false;
    }

    return isValid;
}

const userDB = UserDB.getInstance();
const router = new Router();

router.get('/api/users', (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const users = userDB.getAll();
 
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(users, null, 2));
    res.end();
});

router.get('/api/users/{userId}', (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const userId = req.params?.userId || "";
    const user = userDB.findById(userId);

    if (!uuidv4Validate(userId)) {
        res.statusCode = 400;
    } else if (user) {
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(user, null, 2));
    } else {
        res.statusCode = 404;
    }
    res.end();
});

router.post('/api/users', (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const body = req.body || {};
    const isBodyDataValid = validateUserBody(body as IUser);

    if (isBodyDataValid) {
        const user = new User(body as IUser);

        userDB.save(user);

        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(user, null, 2));
    } else {
        res.statusCode = 400;
    }

    res.end();
});

router.put('/api/users/{userId}', (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const body = req.body || {};
    const userId = req.params?.userId || "";
    const user = userDB.findById(userId);
    const isBodyDataValid = validateUserBody(body as IUser);

    if (!uuidv4Validate(userId) || !isBodyDataValid) {
        res.statusCode = 400;
    } else if (!user) {
        res.statusCode = 404;
    } else if (body) {
        userDB.update(userId, body as User)

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(user, null, 2));
    }

    res.end();
});

router.delete('/api/users/{userId}', (req: ExtendedIncomingMessage, res: ServerResponse): void => {
    const userId = req.params?.userId || "";
    const user = userDB.findById(userId);

    if (!uuidv4Validate(userId)) {
        res.statusCode = 400;
    } else if (user) {
        userDB.deleteById(userId);

        res.statusCode = 204;
    } else {
        res.statusCode = 404;
    }

    res.end();
});

export default router;
