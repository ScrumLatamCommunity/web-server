import { Status } from '@prisma/client';
export class CreateSponsorDto {
  userId: string;
  status: Status;
  name: string;
  specialization: string;
  description: string;
  web: string;
  phone: number;
  socials: string[];
  logo: string;
  bannerWeb: string;
  bannerMobile: string;
}
