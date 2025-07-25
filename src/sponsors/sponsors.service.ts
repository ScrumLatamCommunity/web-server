import {
  BadRequestException,
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
import { RemoveCertificatesDto } from './dto/remove-certificates.dto';

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

  async createSponsor(createSponsorDto: CreateSponsorDto) {
    const { certificatesSponsor, descriptions, ...sponsorData } =
      createSponsorDto;

    // 1. Crear sponsor
    const newSponsor = await this.prisma.sponsorsData.create({
      data: sponsorData,
    });

    // 2. Crear descripciones
    if (descriptions?.length) {
      await this.prisma.sponsorDescription.createMany({
        data: descriptions.map((desc) => ({
          sponsorId: newSponsor.id,
          title: desc.title,
          description: desc.description,
        })),
      });
    }

    // 3. Manejar certificados
    let allCertificates = [];

    if (certificatesSponsor?.length) {
      // Buscar existentes
      const existingCertificates = await this.prisma.certificate.findMany({
        where: {
          title: { in: certificatesSponsor.map((c) => c.title) },
        },
      });

      const existingTitles = existingCertificates.map((c) => c.title);

      // Detectar nuevos
      const newCertificates = certificatesSponsor.filter(
        (cert) => !existingTitles.includes(cert.title),
      );

      const newlyCreatedCerts = [];
      for (const cert of newCertificates) {
        const created = await this.prisma.certificate.create({
          data: {
            title: cert.title,
            url: cert.url,
          },
        });
        newlyCreatedCerts.push(created);
      }

      allCertificates = [...existingCertificates, ...newlyCreatedCerts];

      // Conectar certificados al sponsor
      if (allCertificates.length) {
        await this.prisma.sponsorsData.update({
          where: { id: newSponsor.id },
          data: {
            certificates: {
              connect: allCertificates.map((cert) => ({ id: cert.id })),
            },
          },
        });
      }
    }

    // Opcional: devolver el sponsor con relaciones
    const sponsorWithRelations = await this.prisma.sponsorsData.findUnique({
      where: { id: newSponsor.id },
      include: {
        descriptions: true,
        certificates: true,
      },
    });

    return sponsorWithRelations;
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
          descriptions: true,
          certificates: true,
        },
      });

      this.cachedSponsors = this.shuffleArray(sponsors);
      this.lastShuffleTime = now;
    }

    return this.cachedSponsors;
  }

  findAllPosts() {
    return this.prisma.sponsorsPost.findMany();
  }

  findAllOfferts() {
    return this.prisma.sponsorsOffert.findMany();
  }

  async findOneSponsorUser(userId: string) {
    const foundSponsor = await this.prisma.sponsorsData.findUnique({
      where: { userId }, // Buscar por userId ya que es único en SponsorsData
      include: {
        user: true,
        posts: true,
        offers: true,
        descriptions: true,
        certificates: true,
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
        descriptions: true,
        certificates: true,
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
        descriptions: true,
        certificates: true,
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
        },
      });
    }

    const {
      userId, // ❌ No se puede actualizar
      descriptions,
      certificatesSponsor,
      country,
      ...sponsorData
    } = updateSponsorDto;

    // Actualizar descripciones
    if (descriptions) {
      await this.prisma.sponsorDescription.deleteMany({
        where: { sponsorId: id },
      });

      if (descriptions.length > 0) {
        await this.prisma.sponsorDescription.createMany({
          data: descriptions.map((desc) => ({
            sponsorId: id,
            title: desc.title,
            description: desc.description,
          })),
        });
      }
    }

    if (certificatesSponsor) {
      await this.prisma.sponsorsData.update({
        where: { id },
        data: { certificates: { set: [] } },
      });

      const certs: any[] = [];
      for (const cert of certificatesSponsor) {
        let existing = await this.prisma.certificate.findFirst({
          where: {
            title: cert.title,
            url: cert.url,
          },
        });

        if (!existing) {
          existing = await this.prisma.certificate.create({
            data: {
              title: cert.title,
              url: cert.url,
            },
          });
        }

        certs.push(existing);
      }

      if (certs.length > 0) {
        await this.prisma.sponsorsData.update({
          where: { id },
          data: {
            certificates: {
              connect: certs.map((cert) => ({ id: cert.id })),
            },
          },
        });
      }
    }

    this.cachedSponsors = [];
    this.lastShuffleTime = 0;

    return updateSponsorDto;
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

  async getAllCertificates() {
    return this.prisma.certificate.findMany({
      select: {
        id: true,
        title: true,
        url: true,
      },
    });
  }

  async removeCertificatesFromSponsor(
    sponsorId: string,
    dto: RemoveCertificatesDto,
  ) {
    const sponsorExists = await this.prisma.sponsorsData.findUnique({
      where: { id: sponsorId },
    });

    if (!sponsorExists) {
      throw new NotFoundException(`Sponsor with id ${sponsorId} not found`);
    }

    await this.prisma.sponsorsData.update({
      where: { id: sponsorId },
      data: {
        certificates: {
          disconnect: dto.certificateIds.map((id) => ({ id })),
        },
      },
    });

    return {
      message: `Certificates removed from sponsor ${sponsorId}`,
      removedCertificates: dto.certificateIds,
    };
  }
}
