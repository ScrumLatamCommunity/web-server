import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CertificateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
