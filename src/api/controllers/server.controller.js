import { StatusCodes } from 'http-status-codes';
import prismaClient from '../../libs/prismaClient.js';
import ServerDTO from '../dtos/server.dto.js';

class ServerController {
  prismaClient;

  constructor({ prismaClient }) { 
    this.prismaClient = prismaClient;
  }

  async list(req,res,next) {
    try {
      const servers = await this.prismaClient.server.findMany({});

      res.status(StatusCodes.OK).json(servers.map(ServerDTO.from));
    } catch (e) {
      next(e);
    }
  }
}

const serverController = new ServerController({ prismaClient });

export default serverController;
