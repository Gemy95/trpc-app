import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import * as mime from 'mime-types';
import { Multer } from 'multer';
import * as path from 'path';
import uniqid from 'uniqid';

@Injectable()
export class StorageService {
  private supportedMimes = ['.jpg', '.jpeg', '.png'];

  async upload(file): Promise<string> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    });

    const ext = path.extname(file.originalname);

    return await new Promise((resolve, reject) => {
      const key = `${process.env.AWS_S3_FOLDER}/${uniqid()}${ext}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: mime.lookup(ext),
        ContentLength: file.buffer.length,
        ACL: 'public-read',
      };
      const options = {
        partSize: 10 * 1024 * 1024, // 10 MB
        queueSize: 10,
      };
      s3.upload(params as PutObjectRequest, options, function (err, data) {
        if (!err) {
          resolve(data.Location); // successful response
        } else {
          reject(err); // an error occurred
        }
      });
    });
  }

  async save(files: Array<Express.Multer.File> | Express.Multer.File): Promise<Array<string>> {
    const rFiles = Array.isArray(files) ? files : [files];
    const tasks = [];
    for (let i = 0; i < rFiles.length; i++) {
      const file = rFiles[i];
      tasks.push(this.upload(file));
    }
    return await Promise.all(tasks);
  }
}
