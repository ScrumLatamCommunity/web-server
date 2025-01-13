import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsType, NewsStatus } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma.$connect();
  }

  async findNews() {
    return await this.prisma.news.findMany({
      where: {
        type: NewsType.NEWS,
        status: NewsStatus.ACTIVE,
      },
    });
  }

  async findBlogs() {
    return await this.prisma.news.findMany({
      where: {
        type: NewsType.BLOGS,
        status: NewsStatus.ACTIVE,
      },
    });
  }

  async findArticles() {
    return await this.prisma.news.findMany({
      where: {
        type: NewsType.ARTICLES,
        status: NewsStatus.ACTIVE,
      },
    });
  }

  async findInactive() {
    return await this.prisma.news.findMany({
      where: {
        type: NewsType.NEWS || NewsType.BLOGS || NewsType.ARTICLES,
        status: NewsStatus.INACTIVE,
      },
    });
  }

  async createNews(createNewsDto: CreateNewsDto) {
    const news = createNewsDto;
    await this.prisma.news.create({ data: news });
    return news;
  }

  async createBlogs(createNewsDto: CreateNewsDto) {
    const news = createNewsDto;
    await this.prisma.news.create({ data: news });
    return news;
  }

  async createArticles(createNewsDto: CreateNewsDto) {
    const news = createNewsDto;
    await this.prisma.news.create({ data: news });
    return news;
  }

  async findOne(id: string) {
    try {
      return await this.prisma.news.findUnique({ where: { id } });
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    try {
      const updatedNews = updateNewsDto;
      updatedNews.updatedAt = new Date();
      await this.prisma.news.update({
        where: { id },
        data: updatedNews,
      });
      return updatedNews;
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async switchStatus(id: string) {
    try {
      const disabledNews = await this.prisma.news.findUnique({ where: { id } });
      if (!disabledNews) {
        return new HttpException('News not found', HttpStatus.NOT_FOUND);
      }
      if (disabledNews.status === NewsStatus.INACTIVE) {
        disabledNews.updatedAt = new Date();
        disabledNews.status = NewsStatus.ACTIVE;
        await this.prisma.news.update({
          where: { id },
          data: disabledNews,
        });
      } else {
        disabledNews.updatedAt = new Date();
        disabledNews.status = NewsStatus.INACTIVE;
        await this.prisma.news.update({
          where: { id },
          data: disabledNews,
        });
      }
      return disabledNews;
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
