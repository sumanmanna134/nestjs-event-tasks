import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './dto/create-user.request';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): HealthInterface {
    return this.appService.getHello(req);
  }

  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<void> {
    this.appService.createUser(body);
  }
}
