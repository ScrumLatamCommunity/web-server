import { SponsorsData } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  onboarding: boolean;
  firstName: string;
  lastName: string;
  username: string;
  country: string[];
  membership: string;
  profilePictureUrl?: string;
  sponsorData?:
    | (SponsorsData & {
        descriptions: any[];
        certificates: any[];
      })
    | null;
}
