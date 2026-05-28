import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor() {
    // Configurar Cloudinary si hay credenciales
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    // Si hay Cloudinary configurado, subir ahí
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `sportshub/${folder}`, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        ).end(file.buffer);
      });
    }

    // Si no, guardar localmente en /uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    return `/uploads/${filename}`;
  }
}
