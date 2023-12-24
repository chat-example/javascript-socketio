import channelService from "../services/channel.service.js";
import { StatusCodes, ReasonPhrases} from 'http-status-codes';
import { authByToken } from '../../utils/functions.js';

class ChannelController {
  constructor({ channelService }) {
    this.channelService = channelService;
  }

  async create(req, res, next) {
    authByToken(req, res, next, async (user) => {
      try {
        const { serverId } = req.params;
  
        const createdChannel = await this.channelService.create({ user, serverId, channel: req.body });
  
        res.status(StatusCodes.CREATED).json(createdChannel);
      } catch (error) {
        next(error);
      }
    });
  }

  async update(req, res, next) {
    authByToken(req, res, next, async (user) => {
      try {
        const { serverId } = req.params;
        const { channel } = req.body;
  
        const updatedChannel = await this.channelService.update({ user, serverId, channel });
  
        res.status(StatusCodes.OK).json(updatedChannel);
      } catch (error) {
        next(error);
      }
    });
  }

  async delete(req, res, next) {
    authByToken(req, res, next, async (user) => {
      try {
        const { channelId, serverId } = req.params;
  
        await this.channelService.delete({ user, serverId, channelId });
  
        res.status(StatusCodes.NO_CONTENT).send();
      } catch (error) {
        next(error);
      }
    });
  }
}

const channelController = new ChannelController({ channelService });

export default channelController;
