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

    const { name, description, icon, banner } = server;

    const updatedServer = await this.prismaClient.server.create({
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
