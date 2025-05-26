// src/cloudinary/cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import { Provider } from '@nestjs/common';

export const CLOUDINARY_PROVIDER_TOKEN = 'Cloudinary'; // Token para inyección

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY_PROVIDER_TOKEN,
  useFactory: (): void => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
