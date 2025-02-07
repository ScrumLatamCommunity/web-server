import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { CreateSponsorsPostDto } from './dto/create-post.dto';
import { CreateSponsorsOffertDto } from './dto/create-offert.dto';

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

  @Get(':id')
  findOneSponsor(@Param('id') id: string) {
    try {
      return this.sponsorsService.findOneSponsor(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  findAllPosts() {
    try {
      return this.sponsorsService.findAllPosts();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  findOnePost(@Param('id') id: string) {
    try {
      return this.sponsorsService.findOnePost(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  findAllOffert() {
    try {
      return this.sponsorsService.findAllOfferts();
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  findOneOffert(@Param('id') id: string) {
    try {
      return this.sponsorsService.findOneOffert(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  createSponsor(@Body() createSponsorDto: CreateSponsorDto) {
    try {
      return this.sponsorsService.createSponsor(createSponsorDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  createPost(@Body() createSponsorPostDto: CreateSponsorsPostDto) {
    try {
      return this.sponsorsService.createPost(createSponsorPostDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  createOffert(@Body() createSponsorOffertDto: CreateSponsorsOffertDto) {
    try {
      return this.sponsorsService.createOffert(createSponsorOffertDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  updateSponsor(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
  ) {
    try {
      return this.sponsorsService.updateSponsor(id, updateSponsorDto);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  switchSponsorStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchSponsorStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  switchPostStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchPostStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  switchOffertStatus(@Param('id') id: string) {
    try {
      return this.sponsorsService.switchOffertStatus(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
