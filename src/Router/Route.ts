import { RouteHandler } from '../types/HTTPServerTypes';

type RouteParameter = {
    name?: string;
    value?: string;
}

export default class Route {
    path: string;
    method: string;
    handler: RouteHandler;
    regExp: RegExp;
    parameter: RouteParameter;

    constructor(path: string, method: string, handler: RouteHandler) {
        this.path = path;
        this.method = method;
        this.handler = handler;
        this.parameter = {};
        this.regExp = this.getRegExp();
    }

    getRegExp(): RegExp {
        return new RegExp(this.path.replace(/(.*)({(.*)})/, "$1(?<$3>.*)") + "$");
    }

    isRouteMatch(method: string, path: string): boolean {
        return method === this.method && this.regExp.test(path);
    }


    getParameters(method: string, path: string): RouteParameter | null {
        let parameter;
         if (this.isRouteMatch(method, path)) {
            parameter = path.match(this.regExp)?.groups || {};
        } else {
            parameter = null;
        }

        return parameter;
    }
}
