import prismaClient from '../../libs/prismaClient.js';
import ChannelGroupDTO from '../dtos/channelGroup.dto.js';

class ChannelGroupService {
  constructor({prismaClient}) {
    this.prismaClient = prismaClient;
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

  async create({ serverId, channelGroup }) {
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

  async update({ serverId, channelGroup }) {
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
});

export default channelGroupService;
