import { createServer }  from 'http';
import app from './config/express.config.js';
import { PORT, ENV } from './constants/index.js';
import logger from './utils/logger.js';
import { Server } from 'socket.io';

const server = createServer(app);
server.listen(PORT, (error) => {
  if (error) {
    return logger.error('server failed to start', error);
  }

  return logger.info(`server started [env, port] = [${ENV}, ${PORT}]`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    console.log(data);
    io.emit("receive_message", data);
  })

  socket.on('disconnect', (data) => {
    console.log(data);
    console.log('disconnection')
  })
})

export default server;
