import { IsUrl } from 'class-validator';

export class UpdatePhotoDto {
  @IsUrl()
  photo: string;
}
