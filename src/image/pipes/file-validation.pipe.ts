import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TYPES_IMAGE, ValidImageMimeType } from '../constants/image.constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const isValidType = Object.values(TYPES_IMAGE).includes(
      file.mimetype as ValidImageMimeType,
    );

    if (!isValidType) {
      throw new BadRequestException(
        `Tipo de archivo no válido. Tipo permitidos: ${Object.values(
          TYPES_IMAGE,
        ).join(', ')}`,
      );
    }

    return file;
  }
}

