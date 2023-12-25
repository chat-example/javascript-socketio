import { createServer }  from 'http';
import app from './config/express.config.js';
import { PORT, ENV } from './constants/index.js';
import logger from './utils/logger.js';
import io from './config/socket.config.js';

const server = createServer(app);
server.listen(PORT, (error) => {
  if (error) {
    return logger.error('server failed to start', error);
  }

  return logger.info(`server started [env, port] = [${ENV}, ${PORT}]`);
});

io(server);

export default server;
