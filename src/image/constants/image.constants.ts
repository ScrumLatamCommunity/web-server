export const TYPES_IMAGE = {
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  jpg: 'image/jpg',
  png: 'image/png',
} as const;

export type ValidImageMimeType = (typeof TYPES_IMAGE)[keyof typeof TYPES_IMAGE];
