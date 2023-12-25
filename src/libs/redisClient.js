import { createClient } from 'redis';
import { REDIS_PATH } from '../constants';

class Redis {
  constructor({ url }) {
    this.redisClient = redis.createClient({
      url
    });
    this.redisClient.on('connect', () => {
      console.info('redis client connected');
    })
    this.redisClient.on('error', (err) => {
      console.error("redis client error", err);
    });

    this.redisClient.connect().then();
  }
}

class PubSub extends Redis {
  constructor(url) {
    super(url);
  }

  async subscribe(channel) {
    await this.redisClient.subscribe(channel, (message) => {
      console.log("message : ", message);
    });

    console.info('채널 연결 완료');
  }

  async unsubscribe(channel) {
    await this.redisClient.unsubscribe(channel);
  }

  async pSubscribe(channel) {
    await this.redisClient.pSubscribe(channel, (message, channel) => {
      console.log("channel : %s, message : %s", channel, message);
    });

    console.info('채널(패턴) 연결 완료');
  }

  async pUnsubscribe(channel) {
    await this.redisClient.pUnsubscribe(channel);
  }

  async publish(channel, message) {
    await this.redisClient.publish(channel, message);
  }
}

export {
  PubSub,
};
