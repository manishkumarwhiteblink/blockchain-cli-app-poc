import * as redis  from 'redis';
import { Blockchain } from './Blockchain';

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
};

export class PubSub {
  publisher: redis.RedisClientType;
  subscriber: redis.RedisClientType;
  constructor(private blockChain: Blockchain) {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST, (message) => {
      console.log(`Received message in TEST: ${message}`);
    });
    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message) => {
      console.log(`Received message in BLOCKCHAIN: ${message}`);
    });

    this.subscriber.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message recieved.Channel: ${channel} Message: ${message}`);
    const parsedMessage = JSON.parse(message);

    if (channel == CHANNELS.BLOCKCHAIN) {
      this.blockChain.replaceChain(parsedMessage);
    }
  }
  publish(channel: string, message: string) {
    this.publisher.publish(channel, message);
  }
  broadchastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockChain.chain));
  }
}
