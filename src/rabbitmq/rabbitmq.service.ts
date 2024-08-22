import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
      this.connection = await amqp.connect(rabbitMQUrl);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Failed to close RabbitMQ connection', error);
    }
  }

  async publish(queue: string, message: string) {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      throw new Error('RabbitMQ channel is not initialized');
    }

    try {
      await this.channel.assertQueue(queue, { durable: false });
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Message sent to queue ${queue}: ${message}`);
    } catch (error) {
      console.error(`Failed to send message to queue ${queue}`, error);
    }
  }
}
