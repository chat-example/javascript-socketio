import { StatusCodes } from 'http-status-codes';
import prismaClient from '../../libs/prismaClient.js';
import serverService from '../services/server.service.js';
import logger from '../../utils/logger.js';
import { authByToken } from '../../utils/functions.js';

class ServerController {
  prismaClient;
  serverService;
  logger;

  constructor({ prismaClient, serverService, logger }) { 
    this.prismaClient = prismaClient;
    this.serverService = serverService;
    this.logger = logger;
  }

  async list(req,res,next) {
    authByToken(req, res, next, (async (user) => {
      try {
        const servers = await this.serverService.list({ user });

        res.status(StatusCodes.OK).json(servers);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }

  async create(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        const server = await this.serverService.create({ user, server: req.body });

        res.status(StatusCodes.CREATED).json(server);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }

  async update(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        const server = await this.serverService.update({ user, server: req.body });

        res.status(StatusCodes.OK).json(server);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }

  async delete(req, res, next) {
    authByToken(req, res, next, (async (user) => { 
      try {
        const { serverId }  = req.params;
        await this.serverService.delete({user, server: { id: serverId }});

        res.status(StatusCodes.NO_CONTENT).send();
      } catch (error) { 
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }

  async join(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        const server = await this.serverService.join({ user, server: req.body });

        res.status(StatusCodes.OK).json(server);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }

  async leave(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        await this.serverService.leave({ user, server: req.body });

        res.status(StatusCodes.NO_CONTENT).send();
      } catch (error) { 
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }
}

const serverController = new ServerController({ prismaClient, serverService, logger });

export default serverController;
