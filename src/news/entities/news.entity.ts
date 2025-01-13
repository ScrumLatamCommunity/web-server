import { NewsType, NewsStatus } from '@prisma/client';

export class News {
  id: string;
  title: string;
  description: string;
  image: string;
  type: NewsType;
  status: NewsStatus;
  createdAt: Date;
  updatedAt: Date;
}
