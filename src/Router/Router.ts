import Route from './Route';
import { ServerResponse } from 'http';

import { ExtendedIncomingMessage } from '../types/HTTPServerTypes';
import { RouteHandler } from '../types/HTTPServerTypes';


type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default class Router {
    routes: Route[];

    constructor() {
        this.routes = [];
    }

    async handleRequest(request: ExtendedIncomingMessage, response: ServerResponse) {
        const requestMethod = request.method as HTTPMethod;
        const path = request.url as string;
        const route = this.getRoute(requestMethod, path);

        if (route) {
            request.params = route.getParameters(requestMethod, path);
            request.body = await this.getBodyForRequest(request) as { [key: string]: any } | undefined;
            route.handler(request, response);
        } else {
            response.statusCode = 404;
            response.statusMessage = 'Not Found';
            response.end();
        }
    }

    getBodyForRequest(request: ExtendedIncomingMessage): Promise<any> {
        let body = "";

        request.on("data", (chunk: BinaryData) => {
            body += chunk.toString();
        });


        return new Promise((res, rej) => {
            request.on("end", () => {
                res(JSON.parse(body || '{}'));
            });
            request.on("error", (err) => {
                res(undefined);
            });
        });
    }

    getRoute(method: string, path: string): Route | undefined {
        return this.routes.find((route) => route.isRouteMatch(method, path));
    }

    get(path: string, handler: RouteHandler) {
        const route = new Route(path, 'GET', handler);

        this.routes.push(route);
    }

    put(path: string, handler: RouteHandler) {
        const route = new Route(path, 'PUT', handler);

        this.routes.push(route);
    }

    post(path: string, handler: RouteHandler) {
        const route = new Route(path, 'POST', handler);

        this.routes.push(route);
    }

    delete(path: string, handler: RouteHandler) {
        const route = new Route(path, 'DELETE', handler);

        this.routes.push(route);
    }

}