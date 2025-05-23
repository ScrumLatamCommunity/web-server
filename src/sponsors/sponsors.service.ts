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

  private cachedSponsors: any[] = [];
  private lastShuffleTime: number = 0;

  private shuffleArray(array: any[]) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
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

  async findAllSponsors() {
    const now = Date.now();
    const oneHour = 30 * 60 * 1000;

    if (
      now - this.lastShuffleTime > oneHour ||
      this.cachedSponsors.length === 0
    ) {
      const sponsors = await this.prisma.sponsorsData.findMany({
        include: {
          user: {
            select: {
              country: true,
              email: true,
            },
          },
        },
      });

      this.cachedSponsors = this.shuffleArray(sponsors);
      this.lastShuffleTime = now;
    }

    return this.cachedSponsors;
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

    if (!foundSponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    const today = new Date();

    const expiredOffers = foundSponsor.offers.filter(
      (offert) =>
        new Date(offert.validUntil) < today && offert.status === 'ACTIVE',
    );

    if (expiredOffers.length > 0) {
      await this.prisma.sponsorsOffert.updateMany({
        where: {
          id: { in: expiredOffers.map((offert) => offert.id) },
        },
        data: { status: 'INACTIVE' },
      });
    }

    const expiredPosts = foundSponsor.posts.filter(
      (post) => new Date(post.validUntil) < today && post.status === 'ACTIVE',
    );

    if (expiredPosts.length > 0) {
      await this.prisma.sponsorsPost.updateMany({
        where: {
          id: { in: expiredPosts.map((post) => post.id) },
        },
        data: { status: 'INACTIVE' },
      });
    }

    return this.prisma.sponsorsData.findUnique({
      where: { id },
      include: {
        user: true,
        posts: true,
        offers: true,
      },
    });
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
      include: {
        user: true,
      },
    });

    if (!sponsorExists) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    if (updateSponsorDto.country) {
      await this.prisma.user.update({
        where: { id: sponsorExists.userId },
        data: {
          country: updateSponsorDto.country,
        }
      });
    }

    // Removemos country del DTO antes de actualizar SponsorsData
    const { country, ...sponsorData } = updateSponsorDto;

    const updatedSponsor = await this.prisma.sponsorsData.update({
      where: { id },
      data: sponsorData,
      include: {
        user: true,
      },
    });
    this.cachedSponsors = [];
    this.lastShuffleTime = 0;
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
