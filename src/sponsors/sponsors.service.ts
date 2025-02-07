import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateSponsorsOffertDto } from './dto/create-offert.dto';
import { CreateSponsorsPostDto } from './dto/create-post.dto';

@Injectable()
export class SponsorsService {
  constructor(private readonly prisma: PrismaService) {
    this.prisma.$connect();
  }

  createSponsor(createSponsorDto: CreateSponsorDto) {
    const sponsor = createSponsorDto;
    const newSponsor = this.prisma.sponsorsData.create({ data: sponsor });
    return newSponsor;
  }

  createPost(createSponsorPostDto: CreateSponsorsPostDto) {
    const { sponsorId, ...postData } = createSponsorPostDto;
    const newPost = this.prisma.sponsorsPost.create({
      data: {
        sponsor: { connect: { id: sponsorId } },
        ...postData,
      },
    });
    return newPost;
  }

  createOffert(createSponsorOffertDto: CreateSponsorsOffertDto) {
    const { sponsorId, ...postOffert } = createSponsorOffertDto;
    const newOffert = this.prisma.sponsorsOffert.create({
      data: { sponsor: { connect: { id: sponsorId } }, ...postOffert },
    });
    return newOffert;
  }

  findAllSponsors() {
    return this.prisma.sponsorsData.findMany();
  }

  findAllPosts() {
    return this.prisma.sponsorsPost.findMany();
  }

  findAllOfferts() {
    return this.prisma.sponsorsOffert.findMany();
  }

  findOneSponsor(id: string) {
    const foundSponsor = this.prisma.sponsorsData.findUnique({ where: { id } });
    if (!foundSponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    } else {
      return foundSponsor;
    }
  }

  findOnePost(id: string) {
    const foundPost = this.prisma.sponsorsPost.findUnique({ where: { id } });
    if (!foundPost) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    } else {
      return foundPost;
    }
  }

  findOneOffert(id: string) {
    const foundOffert = this.prisma.sponsorsOffert.findUnique({
      where: { id },
    });
    if (!foundOffert) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    } else {
      return foundOffert;
    }
  }

  updateSponsor(id: string, updateSponsorDto: UpdateSponsorDto) {
    const foundSponsor = this.prisma.sponsorsData.findUnique({ where: { id } });
    if (!foundSponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    } else {
      return this.prisma.sponsorsData.update({
        where: { id },
        data: updateSponsorDto,
      });
    }
  }

  async switchSponsorStatus(id: string) {
    const foundSponsor = await this.prisma.sponsorsData.findUnique({
      where: { id },
    });
    if (!foundSponsor) {
      return new HttpException('Sponsor not found', HttpStatus.NOT_FOUND);
    } else if (foundSponsor.status === Status.INACTIVE) {
      foundSponsor.status = Status.ACTIVE;
    } else {
      foundSponsor.status = Status.INACTIVE;
    }
    await this.prisma.sponsorsData.update({
      where: { id },
      data: foundSponsor,
    });
    return foundSponsor;
  }

  async switchPostStatus(id: string) {
    const foundPost = await this.prisma.sponsorsPost.findUnique({
      where: { id },
    });
    if (!foundPost) {
      return new HttpException('Post not found', HttpStatus.NOT_FOUND);
    } else if (foundPost.status === Status.INACTIVE) {
      foundPost.status = Status.ACTIVE;
    } else {
      foundPost.status = Status.INACTIVE;
    }
    await this.prisma.sponsorsPost.update({
      where: { id },
      data: foundPost,
    });
    return foundPost;
  }

  async switchOffertStatus(id: string) {
    const foundOffert = await this.prisma.sponsorsOffert.findUnique({
      where: { id },
    });
    if (!foundOffert) {
      return new HttpException('Offert not found', HttpStatus.NOT_FOUND);
    } else if (foundOffert.status === Status.INACTIVE) {
      foundOffert.status = Status.ACTIVE;
    } else {
      foundOffert.status = Status.INACTIVE;
    }
    await this.prisma.sponsorsOffert.update({
      where: { id },
      data: foundOffert,
    });
    return foundOffert;
  }
}
