import prismaClient from '../../libs/prismaClient.js';
import { hashString } from '../../utils/functions.js';
import logger from '../../utils/logger.js';
import UserDTO from '../dtos/user.dto.js';

class UserService {
  prisma
  logger
  constructor({ logger, prisma }) {
    this.prisma= prisma;
    this.logger = logger;
  }

  async signInByEmail({ email, password }) {
    this.logger.info(`user login start`);

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });

    this.logger.info(`user login start with id ${user?.id}`);

    if (!user) {
      throw new Error('User not found');
    }

    this.logger.info(`user login success with id ${user?.id}`);

    const { hash }  = await hashString(password, user.salt);

    this.logger.info(`user passcheck start with id ${user?.id}`)

    if (user.password !== hash) {
      throw new Error('Password is incorrect');
    }

    this.logger.info(`user passcheck success with id ${user?.id}`)

    return UserDTO.from(user);
  }

  async getUserById({ id }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return UserDTO.from(user);
  }

  async create({ email, password, nickname, }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (user) {
      throw new Error('User already exists');
    }

    const { hash, salt }  = await hashString(password);

    const createdUser  = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        nickname,
        salt
      },
    });

    return UserDTO.from(createdUser);
  }
}

const userService = new UserService({ prisma: prismaClient, logger });

export default userService;