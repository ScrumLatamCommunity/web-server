import { Upload } from '@aws-sdk/lib-storage';
import { S3UploadResponse } from './interfaces/image.interfaces';
import { S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FormatUrlService } from './utils/format.url';
import { envs } from 'src/config/envs';

@Injectable()
export class ImageService {
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private formatUrlService: FormatUrlService) {
    this.s3Client = new S3Client({
      endpoint: envs.endpointUrl,
      credentials: {
        accessKeyId: envs.awsAccessKey,
        secretAccessKey: envs.awsSecretAccessKey,
      },
      region: 'auto',
    });

    this.bucketName = envs.bucketName;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<S3UploadResponse> {
    if (!file.buffer) {
      throw new BadRequestException('No se pudo leer el archivo');
    }

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: `${folder}/${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      },
    });

    try {
      const result = await upload.done();

      if (!result.Location || !result.Key) {
        throw new BadRequestException('Error al subir el archivo');
      }

      const url = this.formatUrlService.getFormatUrl(result.Location);

      if (!url) {
        throw new BadRequestException('Error al subir el archivo');
      }

      return {
        url,
        key: result.Key,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al subir el archivo');
    }
  }
}
