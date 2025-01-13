import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { TypeGuard } from 'src/guards/NewsType.guard';

@Controller('new-section')
@UseGuards(TypeGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('news')
  findNews() {
    try {
      return this.newsService.findNews();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post('news')
  createNews(@Body() createNewsDto: CreateNewsDto) {
    try {
      return this.newsService.createNews(createNewsDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('blogs')
  findBlogs() {
    try {
      return this.newsService.findBlogs();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post('blogs')
  createBlogs(@Body() createNewsDto: CreateNewsDto) {
    try {
      return this.newsService.createBlogs(createNewsDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('articles')
  findArticles() {
    try {
      return this.newsService.findArticles();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post('articles')
  createArticles(@Body() createNewsDto: CreateNewsDto) {
    try {
      return this.newsService.createArticles(createNewsDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.newsService.findOne(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('inactive')
  findInactive() {
    try {
      return this.newsService.findInactive();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    try {
      return this.newsService.update(id, updateNewsDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('status/:id')
  switchStatus(@Param('id') id: string) {
    try {
      return this.newsService.switchStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
