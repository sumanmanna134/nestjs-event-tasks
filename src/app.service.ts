import { Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { Request } from 'express';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(AppService.name);
  getHello(req: Request): HealthInterface {
    return {
      message: 'hello World!',
      ip: req.socket.remoteAddress,
      method: req.method,
      url: req.headers.host + req.url,
      protocol: req.protocol,
      host: req.headers.host,
      userAgent: req.headers['user-agent'],
    };
  }

  async createUser(body: CreateUserRequest) {
    this.logger.log('Creating user...', body);
    const fakeUserId = '123';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(fakeUserId, body.email),
    );

    const establishSocketTimeout = setTimeout(
      () => this.establishWebSocketConnection(fakeUserId),
      5000,
    );

    this.schedulerRegistry.addTimeout(
      `${fakeUserId}_establish_ws`,
      establishSocketTimeout,
    );
  }

  private establishWebSocketConnection(userId: string) {
    this.logger.log('Establishing websocket connection with user...', userId);
  }

  @OnEvent('user.created')
  welcomeNewUser(payload: UserCreatedEvent) {
    this.logger.log('Welcoming new User...', payload.email);
  }

  @OnEvent('user.created')
  async sendWelcomeGift(payload: UserCreatedEvent) {
    this.logger.log('Sending welcome gift');
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
    this.logger.log('Welcome gift sent', payload.email);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'delete_expire_users' })
  deleteExpireUsers() {
    this.logger.log('Deleting Expire User... ');
  }
}
