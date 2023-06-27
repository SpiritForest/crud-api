import { IncomingMessage, ServerResponse } from 'http';

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
        // let regExp: RegExp;
        // const mandatoryParameterMatchResult = this.path.match(/(.*){(\w+)}/);
        return new RegExp(this.path.replace(/(.*)({(.*)})/, "$1(?<$3>.*)") + "$");
        // const mandatoryParameterMatchResult = this.path.replace(/(.*)({(.*)})/, "$1(?<$3>.*)$");

        // if (mandatoryParameterMatchResult) {
        //     const pathBeforeParameter = mandatoryParameterMatchResult[1];
        //     this.parameter.name = mandatoryParameterMatchResult[2];

        //     regExp = new RegExp(pathBeforeParameter + '(?<value>\\w+)$');
        // } else {
        //     regExp = new RegExp(this.path + "$");
        // }

        // return regExp;
    }

    isRouteMatch(method: string, path: string): boolean {
        return method === this.method && this.regExp.test(path);
    }


    getParameters(method: string, path: string): RouteParameter | null {
        // let parameter: RouteParameter | null;
        // if (this.isRouteMatch(method, path)) {
        //     const parameterValue = (path.match(this.regExp) || [])[1];
        //     if (parameterValue) {
        //         this.parameter.value = parameterValue;
        //     }
        //     parameter = this.parameter;
        // } else {
        //     parameter = null;
        // }

        // return parameter;
        let parameter;
         if (this.isRouteMatch(method, path)) {
        //     const parameterValue = (path.match(this.regExp) || [])[1];
        //     if (parameterValue) {
        //         this.parameter.value = parameterValue;
        //     }
        //     parameter = this.parameter;
            parameter = path.match(this.regExp)?.groups || {};
        } else {
            parameter = null;
        }

        return parameter;
    }
}
