import { startServer } from "./main";
import config from './config';

startServer().then(() => {
  console.log(`Server is running on port: ${config.PORT}`);
}).catch((err) => {
  console.log(`The error has been occurred while starting the server`, err);
});