import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error-code';
import {
  r2Account,
  r2BucketName,
  r2Client,
  r2PublicUrl,
  r2Secret,
} from 'src/utils/config';

@Injectable()
export class FileService {
  private s3: S3Client;
  private accountId: string;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.accountId = r2Account as string;
    this.bucketName = r2BucketName as string;
    this.publicUrl = r2PublicUrl as string;

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2Client as string,
        secretAccessKey: r2Secret as string,
      },
    });
  }
  async uploadFile(file: Express.Multer.File, id: string) {
    const fileName = file.originalname || file.filename || 'file';
    const key = `${id}/${Date.now()}-${fileName}`;
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return { key, publicUrl: `${this.publicUrl}/${key}` };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to upload file',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteFile(key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch {
      throw new InternalServerErrorException({
        message: 'Failed to delete file',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteManyFile(filePaths: string[]) {
    try {
      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: {
            Objects: filePaths.map((key) => ({ Key: key })),
            Quiet: true,
          },
        }),
      );
    } catch {
      throw new InternalServerErrorException({
        message: 'Failed to delete multiple files',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
