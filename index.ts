import http, { IncomingMessage, ServerResponse } from 'http';
import config from './config';
import UserRouter from './src/routes/UserRouter';
import { ExtendedIncomingMessage } from './src/types/HTTPServerTypes';

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

const server = http.createServer(requestListener);

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(config.PORT, () => {
  console.log(`Server is running on port: ${config.PORT}`);
});
