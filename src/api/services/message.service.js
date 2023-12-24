import prismaClient from '../../libs/prismaClient.js';
import serverJoinedUserService from './serverJoinedUser.service.js';
import logger from '../../utils/logger.js';
import { MessageDTO } from '../dtos/message.dto.js';

class MessageService {
  prismaClient;
  logger;

  constructor({ prismaClient, serverJoinedUserService, logger }) {
    this.prismaClient = prismaClient;
    this.serverJoinedUserService = serverJoinedUserService;
    this.logger = logger;
  }

  async list({ channelId }) {
    const messageList = await this.prismaClient.message.findMany({
      where: {
        id: BigInt(channelId),
      },
    });

    return messageList.map(MessageDTO.from);
  }

  async create({ user, channelId, message }) {
    const serverJoinedUser = await this.serverJoinedUserService.findOne({ user });

    const { authorId, ...messageData } = message;

    const createdMessage = await this.prismaClient.message.create({
      data: {
        ...messageData,
        channel: {
          connect: {
            id: BigInt(channelId),
          }
        },
        author: {
          connect: {
            id: serverJoinedUser.id,
          }
        }
      }
    });

    return MessageDTO.from(createdMessage);
  }
}

const messageService = new MessageService({ prismaClient, serverJoinedUserService, logger });

export default messageService;
