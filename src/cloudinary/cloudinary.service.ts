// src/cloudinary/cloudinary.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'profile_pictures', // Carpeta por defecto en Cloudinary
    publicIdPrefix?: string, // Prefijo para el public_id, ej., userId
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const options: any = {
        // 'any' para flexibilidad, o define un tipo más estricto
        folder: folder,
        // Transformaciones recomendadas al subir:
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      };

      if (publicIdPrefix) {
        // Crear un public_id único para evitar colisiones y facilitar la referencia
        // Podrías usar algo como `<span class="math-inline">\{publicIdPrefix\}\_profile\_</span>{Date.now()}`
        // O si quieres sobrescribir siempre la misma foto para un usuario:
        options.public_id = `${publicIdPrefix}_profile`;
        options.overwrite = true;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            console.error('Cloudinary Upload Stream Error:', error);
            return reject(
              new InternalServerErrorException(
                'Error al subir la imagen a Cloudinary.',
              ),
            );
          }
          if (!result) {
            return reject(
              new InternalServerErrorException(
                'Respuesta inesperada de Cloudinary (sin resultado).',
              ),
            );
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    // publicId es el ID que Cloudinary asigna, ej: 'profile_pictures/nombre_archivo_sin_extension'
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary Delete Error:', error);
          // No rechazar si la imagen no existe, podría ser un intento de limpiar una imagen que ya no está
          if (error.http_code === 404) {
            console.warn(
              `Intento de eliminar imagen no encontrada en Cloudinary: ${publicId}`,
            );
            return resolve({ result: 'not found' });
          }
          return reject(
            new InternalServerErrorException(
              'Error al eliminar la imagen de Cloudinary.',
            ),
          );
        }
        // 'result' aquí usualmente es un objeto como { result: 'ok' } o { result: 'not found' }
        resolve(result as { result: string });
      });
    });
  }
}
