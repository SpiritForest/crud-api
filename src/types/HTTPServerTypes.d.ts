import { IncomingMessage, ServerResponse } from 'http';

export interface ExtendedIncomingMessage extends IncomingMessage {
    params: {
        [key: string]: string
    } | null;
    body?: { [key: string]: any } | undefined;
}

export type RouteHandler = (req: ExtendedIncomingMessage, res: ServerResponse) => void;

export type IUser = {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
};
