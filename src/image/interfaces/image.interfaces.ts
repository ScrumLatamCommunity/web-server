import { Request } from 'express';

export interface S3UploadResponse {
  url: string;
  key: string;
}

export interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}
