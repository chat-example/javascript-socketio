import prismaClient from '../../libs/prismaClient.js';
import {Role} from "@prisma/client";

class ServerJoinedUserService {
  prismaClient;

  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async isAdmin({ user, server }) {
    const joinedUser = await this.prismaClient.serverJoinedUser.findFirst({
      where: {
        serverId: server.id,
        userId: user.id,
      },
    });

    return joinedUser.role === Role.ADMIN;
  }

  async findOne({ user }) {
    const joinedUser = await this.prismaClient.serverJoinedUser.findFirst({
      where: {
        id: user.id,
      },
    });

    return joinedUser;
  }
}

const serverJoinedUserService = new ServerJoinedUserService(prismaClient);

export default serverJoinedUserService;
