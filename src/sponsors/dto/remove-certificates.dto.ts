import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class RemoveCertificatesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  certificateIds: string[];
}