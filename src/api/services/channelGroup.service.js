import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import prismaClient from '../../libs/prismaClient.js';
import ChannelGroupDTO from '../dtos/channelGroup.dto.js';
import serverJoinedUserService from './serverJoinedUser.service.js';

class ChannelGroupService {
  constructor({prismaClient, serverJoinedUserService}) {
    this.prismaClient = prismaClient;
    this.serverJoinedUserService = serverJoinedUserService;
  }

  async list({ serverId }) {
    const channelGroups = await this.prismaClient.channelGroup.findMany({
      where: {
        serverId,
      },
      select: {
        id: true,
        name: true,
        channels: true,
      },
    });

    return ChannelGroupDTO.from(channelGroups);
  }

  async create({ user, serverId, channelGroup }) {
    if (!this.serverJoinedUserService.isAdmin({user, server: { id: serverId }})) { 
      throw new APIError({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const { name, description } = channelGroup;

    const createdChannelGroup = await this.prismaClient.channelGroup.create({
      data: {
        name,
        description,
        server: {
          connect: {
            id: serverId,
          }
        },
      },
    });

    return ChannelGroupDTO.from(createdChannelGroup);
  }

  async update({ user, serverId, channelGroup }) {
    if (!this.serverJoinedUserService.isAdmin({user, server: {id: serverId,}})) {
      throw new APIError({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const { id, name, description } = channelGroup;

    const updatedChannelGroup = await this.prismaClient.channelGroup.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        server: {
          connect: {
            id: serverId,
          }
        }
      },
    });

    return ChannelGroupDTO.from(updatedChannelGroup);
  }

  async delete({ channelGroup }) {
    if (!this.serverJoinedUserService.isAdmin({user, server: {id: serverId,}})) {
      throw new APIError({
        message: ReasonPhrases.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const { id } = channelGroup;

    await this.prismaClient.channelGroup.delete({
      where: {
        id,
      },
    });
  }
}

const channelGroupService = new ChannelGroupService({
  prismaClient,
  serverJoinedUserService,
});

export default channelGroupService;
