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
    const { sponsorId, validFrom, validUntil, ...postData } =
      createSponsorPostDto;

    const formattedValidFrom = new Date(validFrom);
    const formattedValidUntil = validUntil ? new Date(validUntil) : null;
    const newPost = this.prisma.sponsorsPost.create({
      data: {
        sponsor: { connect: { id: sponsorId } },
        validFrom: formattedValidFrom,
        validUntil: formattedValidUntil,
        ...postData,
      },
    });
    return newPost;
  }

  createOffert(createSponsorOffertDto: CreateSponsorsOffertDto) {
    const { sponsorId, validFrom, validUntil, ...postOffert } =
      createSponsorOffertDto;

    const fromattedValidFrom = new Date(validFrom);
    const formattedValidUntil = validUntil ? new Date(validUntil) : null;
    const newOffert = this.prisma.sponsorsOffert.create({
      data: {
        sponsor: { connect: { id: sponsorId } },
        validFrom: fromattedValidFrom,
        validUntil: formattedValidUntil,
        ...postOffert,
      },
    });
    return newOffert;
  }

  findAllSponsors() {
    return this.prisma.sponsorsData.findMany({
      include: {
        user: {
          select: {
            country: true,
            email: true,
          },
        },
      },
    });
  }

  findAllPosts() {
    console.log('GET /posts ejecutado');
    return this.prisma.sponsorsPost.findMany();
  }

  findAllOfferts() {
    console.log('GET /posts ejecutado');
    return this.prisma.sponsorsOffert.findMany();
  }

  async findOneSponsorUser(userId: string) {
    const foundSponsor = await this.prisma.sponsorsData.findUnique({
      where: { userId }, // Buscar por userId ya que es único en SponsorsData
      include: {
        user: true,
        posts: true,
        offers: true,
      },
    });

    return foundSponsor;
  }

  async findOneSponsor(id: string) {
    const foundSponsor = await this.prisma.sponsorsData.findUnique({
      where: { id },
      include: {
        user: true,
        posts: true,
        offers: true,
      },
    });

    console.log('foundSponsor', foundSponsor);
    if (!foundSponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    return foundSponsor;
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

  async updateSponsor(id: string, updateSponsorDto: UpdateSponsorDto) {
    const sponsorExists = await this.prisma.sponsorsData.findUnique({
      where: { id },
    });

    if (!sponsorExists) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    const updatedSponsor = await this.prisma.sponsorsData.update({
      where: { id },
      data: updateSponsorDto,
    });

    return updatedSponsor;
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
