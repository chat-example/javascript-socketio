import 'dotenv/config';

export const ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const LOG_ENV = process.env.LOG_ENV;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN = 'accessToken';
export const REDIS_PATH = process.env.REDIS_PATH;