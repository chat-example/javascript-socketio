import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants/common.js';
import logger from '../../utils/logger.js';
import userService from '../services/user.service.js';
import prismaClient from '../../libs/prismaClient.js';
import dayjs from 'dayjs';
import passport from 'passport';

class UserController {
  prismaClient;
  userService;
  logger;

  constructor({ logger, userService, prismaClient}) {
    this.logger = logger;
    this.userService = userService;
    this.prismaClient = prismaClient
  }

  async signInByEmail(req, res, next) {
    try {
      this.logger.debug('user email sign in start');
      passport.authenticate('local', (passportError, user, info) => {
        if (passportError || !user) {
          res.status(StatusCodes.BAD_REQUEST).json(info);
        }

        this.logger.debug(`user email sign in success ${user.id}`);
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.status(StatusCodes.BAD_REQUEST).send(loginError);
          }

          const token = jwt.sign({ id: user.id, name: user.nickname }, JWT_SECRET)

          res.cookie('accessKey', token, { expires: dayjs().add(7, 'day').toDate(), httpOnly: true})
          res.status(StatusCodes.NO_CONTENT).send('');
        });
      })(req,res);
    } catch (error) {
      this.logger.error(error)
      next(error)
    }
  }

  async signUpByEmail(req, res, next) {
    try {
      const { email, password, nickname } = req.body;

      const user = await this.userService.create({ email, password, nickname, });

      this.logger.debug(`User created with Id ${user.id}`)

      const token = jwt.sign({ id: user.id, name: user.nickname }, JWT_SECRET)

      res.cookie('accessKey', token, { expires: dayjs().add(7, 'day').toDate(), httpOnly: true})
      res.status(StatusCodes.CREATED).send(String(user.id));
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

  async authByToken(req,res,next) {
    try {
      this.logger.debug('user jwt sign in start');
      passport.authenticate('jwt', (passportError, user, info) => {
        if (passportError || !user) {
          res.status(StatusCodes.BAD_REQUEST).json(info);
        }

        this.logger.debug(`user jwt sign in success ${user.id}`);
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.status(StatusCodes.BAD_REQUEST).send(loginError);
          }

          const token = jwt.sign({ id: user.id, name: user.nickname }, JWT_SECRET)

          res.cookie('accessKey', token, { expires: dayjs().add(7, 'day').toDate(), httpOnly: true})
          res.status(StatusCodes.NO_CONTENT).send('');
        });
      })(req,res);
    } catch (error) {
      this.logger.error(error);
      next(error);
    } 
  }
}

const userController = new UserController({logger, userService, prismaClient});

export default userController