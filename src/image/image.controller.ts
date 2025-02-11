import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './pipes/file-validation.pipe';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(FileValidationPipe)
    file: Express.Multer.File,
    @Body('folder') folder: string = 'images',
  ) {
    return this.imageService.uploadImage(file, folder);
  }
}
