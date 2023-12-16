import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN } from '../../constants/index.js';
import logger from '../../utils/logger.js';
import userService from '../services/user.service.js';
import prismaClient from '../../libs/prismaClient.js';
import dayjs from 'dayjs';
import passport from 'passport';
import UserDTO from '../dtos/user.dto.js';
import { authByToken } from '../../utils/functions.js'

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
    this.logger.debug('[signInByEmail] user email sign in start');
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        res.status(StatusCodes.BAD_REQUEST).json(info);
        return;
      }

      this.logger.debug(`[signInByEmail] user email sign in success ${user.id}`);
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.status(StatusCodes.BAD_REQUEST).send(loginError);
          return;
        }
        this.setTokenOnRes(res, user);

        res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
      });
    })(req, res, next);
  }

  async signUpByEmail(req, res, next) {
    try {
      this.logger.debug('[userController/signUpByEmail] user email sign up start')

      const { email, password, nickname = "temp" } = req.body;

      const user = await this.userService.create({ email, password, nickname, });

      this.logger.debug(`[userController/signUpByEmail] User created with Id ${user.id}`)
      this.setTokenOnRes(res, user);

      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      this.logger.error(error);
      next(error);
    }
  }

    async updateWithToken(req, res, next) {
      authByToken(req, res, next, (async (user) => {
        try {
          const userData = UserDTO.from({
            ...req.body,
            id: user.id
          });
    
          const updatedUser = await this.userService.update(userData);
          res.status(StatusCodes.OK).json(updatedUser);
        } catch (error) {
          this.logger.error(error);
          next(error);
        }
      }).bind(this));
  }

  async signOut(req, res, next) {
    res.clearCookie(ACCESS_TOKEN)
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }

  async deleteWithToken(req, res, next) {
    authByToken(req, res, next, (async (user) => {
      try {
        await this.prismaClient.user.delete({
          where: {
            id: user.id
          },
        });

        res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
      } catch (error) {
        this.logger.error(error);
        next(error);
      }
    }).bind(this));
  }


  async setTokenOnRes(res, user) {
    const token = jwt.sign({ id: user.id, name: user.nickname }, JWT_SECRET)

    res.cookie(ACCESS_TOKEN, token, { expires: dayjs().add(7, 'day').toDate(), httpOnly: true })
  }
}

const userController = new UserController({logger, userService, prismaClient});

export default userController