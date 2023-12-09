import express from 'express';
import { createServer }  from 'http';
import path from 'path';
import { Server }  from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 3550;

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

server.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
