import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: any): Promise<{ url: string }> {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new InternalServerErrorException(
        'Image upload is not configured. Set CLOUDINARY_* env vars or use a poster URL directly.',
      );
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'cinevault/posters',
            transformation: [
              { width: 600, height: 900, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good', fetch_format: 'auto' },
            ],
          },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              reject(
                new InternalServerErrorException('Upload to Cloudinary failed'),
              );
            } else {
              resolve({ url: result.secure_url });
            }
          },
        )
        .end(file.buffer);
    });
  }
}
