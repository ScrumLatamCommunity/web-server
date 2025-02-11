import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { FormatUrlService } from './utils/format.url';

@Module({
  controllers: [ImageController],
  providers: [ImageService, FormatUrlService],
})
export class ImageModule {}
