import { Injectable } from '@nestjs/common';
import Storage from '@src/infra/google-storage-config/storageConfig';

@Injectable()
export default class StorageService {
  async saveFiles( bucketName: string, files: Express.Multer.File[]) {

    try {
      const bucket = await Storage.bucket(bucketName);
      const folder = new Date().toISOString().substring(0, 7);
      const publicUrls = new Array<{ url: string; filename: string }>();

      await files.forEach((file, index) => {
        const f = bucket.file(folder.concat('/').concat(file.originalname));
        f.save(file.buffer as Buffer, { contentType: file.mimetype });

        publicUrls.push({
          url: f.publicUrl(),
          filename: file.originalname,
        });
      });

      return publicUrls;
    } catch (err) {
      throw new Error('Error to save files: ' + err);
    }
  }
}
