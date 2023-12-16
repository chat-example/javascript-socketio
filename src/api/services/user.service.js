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

  async findByEmail({ email, password }) {
    this.logger.debug(`user login start`);

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });

    this.logger.debug(`user login start with id ${user?.id}`);

    if (!user) {
      throw new Error('User not found');
    }

    this.logger.debug(`user login success with id ${user?.id}`);

    const { hash }  = await hashString(password, user.salt);

    this.logger.debug(`user passcheck start with id ${user?.id}`)

    if (user.password !== hash) {
      throw new Error('Password is incorrect');
    }

    this.logger.debug(`user passcheck success with id ${user?.id}`)

    return UserDTO.from(user);
  }

  async findById({ id }) {
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

  async update({ id, email, password, nickname }) {
    this.logger.debug(`[user update] update start with id ${id}`)
    const user = await this.findById({ id });

    this.logger.debug(`[user update] find with id ${id}`)
    if (!user) {
      throw new Error('User not exists');
    }
    this.logger.debug(`[user update] found with id ${user.id}`)

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        password,
        nickname,
      }
    });
    this.logger.debug(`[user update] update end with id ${updatedUser.id}`)

    return UserDTO.from(updatedUser);
  }
}

const userService = new UserService({ prisma: prismaClient, logger });

export default userService;
