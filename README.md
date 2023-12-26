# db design
![chat_example_1_db](https://github.com/chat-example/javascript-socketio/assets/29042329/b9166e9a-4419-46a4-868f-9329eb4afdc1)

# 구조
## user/server/channelGroup/channel/message
client <- REST API -> API <- Prisma -> postgreSQL 

## 채팅
client <- web socket -> API <- redis client -> redis pub/sub

