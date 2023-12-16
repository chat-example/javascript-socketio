import prismaClient from '../../libs/prismaClient.js';

class ServerJoinedUserService {
  prismaClient;

  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async isAdmin({ user, server }) {
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
}

const serverJoinedUserService = new ServerJoinedUserService(prismaClient);

export default serverJoinedUserService;
