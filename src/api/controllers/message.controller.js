import logger from "../../utils/logger.js";
import { StatusCodes } from 'http-status-codes';
import { authByToken } from '../../utils/functions.js';
import messageService from '../services/message.service.js';

class MessageController {
  logger;
  messageService;

  constructor({ messageService,logger }) {
    this.messageService = messageService;
    this.logger = logger
  }

  async list(req, res, next) {
    try {
      this.logger.info(`[channel group / list] list start`);
      const { channelId } = req.params;
      this.logger.info(`[channel group / list] list params: ${channelId}`);
      const messageList = await this.messageService.list({ channelId });

      res.status(StatusCodes.OK).json(messageList);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async create(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        this.logger.info(`[channel group / create] create start]`);
        const { serverId } = req.params;
        const message = await this.messageService.create({ user, serverId, channelGroup: req.body });
  
        res.status(StatusCodes.CREATED).json(message);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }
}

const messageController = new MessageController({
  messageService,
  logger,
});

export default messageController;