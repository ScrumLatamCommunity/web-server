import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { CreateSponsorsPostDto } from './dto/create-post.dto';
import { CreateSponsorsOffertDto } from './dto/create-offert.dto';
import { AuthGuard } from 'src/auth/guard/guard.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.SPONSOR, Role.ADMIN)
@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Get()
  findAllSponsors() {
    try {
      return this.sponsorsService.findAllSponsors();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/posts')
  findAllPosts() {
    console.log('GET /posts ejecutado');
    try {
      return this.sponsorsService.findAllPosts();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/posts/:id')
  findOnePost(@Param('id') id: string) {
    try {
      return this.sponsorsService.findOnePost(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/offerts')
  findAllOffert() {
    console.log('GET /posts ejecutado');
    try {
      return this.sponsorsService.findAllOfferts();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/offerts/:id')
  findOneOffert(@Param('id') id: string) {
    try {
      return this.sponsorsService.findOneOffert(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/user/:id')
  findOneSponsorUser(@Param('id') userId: string) {
    console.log('GET user/:id ejecutado', userId);
    try {
      return this.sponsorsService.findOneSponsorUser(userId);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  findOneSponsor(@Param('id') id: string) {
    console.log('GET /:id ejecutado', id);
    try {
      return this.sponsorsService.findOneSponsor(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  createSponsor(@Body() createSponsorDto: CreateSponsorDto) {
    try {
      return this.sponsorsService.createSponsor(createSponsorDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/posts')
  createPost(@Body() createSponsorPostDto: CreateSponsorsPostDto) {
    try {
      return this.sponsorsService.createPost(createSponsorPostDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/offerts')
  createOffert(@Body() createSponsorOffertDto: CreateSponsorsOffertDto) {
    try {
      return this.sponsorsService.createOffert(createSponsorOffertDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateSponsor(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
  ) {
    try {
      return this.sponsorsService.updateSponsor(id, updateSponsorDto);
    } catch (error) {
      console.log(error);
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/switchSponsorStatus/:id')
  switchSponsorStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchSponsorStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/switchPostStatus/:id')
  switchPostStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchPostStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  @Patch('/switchOffertStatus/:id')
  switchOffertStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchOffertStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
