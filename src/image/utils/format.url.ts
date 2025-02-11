import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';

@Injectable()
export class FormatUrlService {
  constructor() {}

  getFormatUrl(url: string): string {
    if (!url || url.length === 0) {
      return '';
    }

    try {
      const matches = url.match(/\/([^/]+\/[^/]+)$/);
      if (!matches || !matches[1]) {
        return '';
      }

      const filePath = matches[1];
      const domain = envs.domain?.replace(/\/$/, '');

      return `${domain}/${filePath}`;
    } catch (error) {
      console.error('Error formateando URL:', error);
      return '';
    }
  }
}

