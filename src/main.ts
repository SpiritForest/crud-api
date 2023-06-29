import http, { IncomingMessage, ServerResponse } from 'http';
import config from './config';
import UserRouter from './routes/UserRouter';
import { ExtendedIncomingMessage } from './types/HTTPServerTypes';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const extendedReq: ExtendedIncomingMessage = Object.assign(req, {
    params: {},
    body: {},
  });

  UserRouter.handleRequest(extendedReq, res)
    .catch((err) => {
      res.statusCode = 500;
      res.end();
    });
};

export const startServer = (): Promise<http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>> => {
  const server = http.createServer(requestListener);

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });
  
  return new Promise((res, rej) => {
    server.listen(config.PORT, res.bind(null, server));
    server.on('error', rej);
  });
};