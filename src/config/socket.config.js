import { PubSub } from '../libs/redisClient.js';
import { REDIS_PATH } from '../constants/index.js';
import { Server} from 'socket.io'
import MessageDTO from '../api/dtos/message.dto.js';


function io(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    }
  });

  
  io.on('connection', (socket) => {
    const subscriber = new PubSub({ url: REDIS_PATH });
    const publisher = new PubSub({ url: REDIS_PATH });

    const channel = `${socket.handshake.auth.serverId}_${socket.handshake.auth.channelGroupId}_${socket.handshake.auth.channelId}`;
    subscriber.subscribe(channel, (message, ...a) => {
      console.log('received message: %s, rest: %s' + JSON.stringify(message), JSON.stringify(a));
      io.emit('receive_message', MessageDTO.from({content: message}))
    });

    socket.on('send_message', (data) => {
      console.log(data);
      publisher.publish(channel, data.message);
    });
  
    socket.on('disconnect', (data) => {
      console.log(data);
      console.log('disconnection')
    })
  })
}

export default io;
