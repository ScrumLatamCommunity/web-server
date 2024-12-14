import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to PostgreSQL');
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
