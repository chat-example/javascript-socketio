import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import prismaClient from '../../prisma/client';
import logger from '../../utils/logger';
import { Role } from '@prisma/client';
import APIError from '../../utils/APIError'
import ServerDTO from '../dtos/server.dto';

class ServerService {
  constructor({ prismaClient, logger }) {
    this.prismaClient = prismaClient;
    this.logger = logger;
  }

  async isOwner({ user, server }) {
    const joinedUser = await this.prismaClient.serverJoinedUser({
      where: {
        serverId_userId: {
          serverId: server.id,
          userId: user.id,
        }
      },
    });

    return joinedUser.role === Role.ADMIN;
  }

  async list({ user }) {
    const servers = await this.prismaClient.serverJoinedUser.findMany({
      where: {
        userId: user.id,
      },
      select: {
        server: true,
      },
    });

    return servers.map(({ server }) => ServerDTO.from(server));
  }

  async create({ user, server }) {
    const { name, description, icon, banner } = server;

    const createdServer = await this.prismaClient.server.create({
      data: {
        name,
        description,
        icon,
        banner,
      },
    });

    await this.prismaClient.serverJoinedUser.create({
      data: {
        user: {
          connect: {
            id: user.id,
          }
        },
        server: {
          connect: {
            id: createdServer.id,
          }
        },
        role: Role.ADMIN,
      }
    });

    return ServerDTO.from(createdServer);
  }

  async update({ user, server }) {
    if (!this.isOwner({ user, server })) {
      throw new APIError({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const { id, name, description, icon, banner } = server;

    const updatedServer = await this.prismaClient.server.update({
      where: { id: id },
      data: {
        name,
        description,
        icon,
        banner,
      },
    });
  
    return ServerDTO.from(updatedServer);
  }

  async delete({ user, server }) {
    if (!this.isOwner({ user, server })) {
      throw new APIError({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const deletedServer = await this.prismaClient.server.delete({
      where: { id: server.id },
    });

    return ServerDTO.from(deletedServer);
  }

  async join({ user, server }) {
    const joinedUser = await this.prismaClient.serverJoinedUser({
      where: {
        serverId_userId: {
          serverId: server.id,
          userId: user.id,
        }
      },
    });

    if (joinedUser) {
      return joinedUser;
    }

    return await this.prismaClient.serverJoinedUser.create({
      data: {
        user: {
          connect: {
            id: user.id,
          }
        },
        server: {
          connect: {
            id: server.id,
          }
        },
        role: Role.USER,
      }
    });
  }

  async leave({ user, server }) { 
    const { count } = this.prismaClient.serverJoinedUser.aggregate({
      where: {
        serverId: server.id,
        role: Role.ADMIN,
      },
      count: true,
    });

    if (count <= 1) {
      throw new APIError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Cannot leave server with only one owner',
      });
    }

    await this.prismaClient.serverJoinedUser.delete({
      where: {
        serverId_userId: {
          serverId: server.id,
          userId: user.id,
        }
      },
    });

  }
}

const serverService = new ServerService({
  prismaClient: prismaClient,
  logger: logger,
});

export default serverService;
