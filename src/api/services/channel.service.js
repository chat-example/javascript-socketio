import prismaClient from '../../libs/prismaClient.js';
import serverJoinedUserService from './serverJoinedUser.service.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

class ChannelService {
  prismaClient;

  constructor({ prismaClient, serverJoinedUserService }) {
    this.prismaClient = prismaClient;
    this.serverJoinedUserService = serverJoinedUserService;
  }

  async create({ user, serverId, channel }) {
    if (!this.serverJoinedUserService.isAdmin({ user, server: {id: serverId} })) {
      throw new APIError({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const { channelGroupId, ...channelData } = channel;

    const createdChannel = await this.prismaClient.channel.create({
      data: {
        ...channelData,
        channelGroup: {
          connect: {
            id: BigInt(channelGroupId)
          }
        },
      },
    });

    return createdChannel;
  }

  async update({ user, serverId, channel }) {
    if (!this.serverJoinedUserService.isAdmin({ user, serverId })) {
      throw new APIError({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const { id, channelGroupId } = channel;

    const updatedChannel = await this.prismaClient.channel.update({
      where: {
        id
      },
      data: {
        ...channel,
        channelGroup: {
          connect: {
            id: channelGroupId
          }
        },
      },
    });

    return updatedChannel;
  }

  async delete({ user, serverId, channelId }) {
    if (!this.serverJoinedUserService.isAdmin({ user, serverId })) {
      throw new APIError({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const deletedChannel = await this.prismaClient.channel.delete({
      where: {
        id: channelId
      }
    });

    return deletedChannel;
  }
}

const channelService = new ChannelService({ prismaClient, serverJoinedUserService });

export default channelService;
