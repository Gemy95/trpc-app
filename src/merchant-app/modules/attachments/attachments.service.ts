import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Express } from 'express';
import { v4 as uuidv } from 'uuid';

import { ERROR_CODES } from '../../../libs/utils/src/lib/utils';

import 'multer';

@Injectable()
export class AttachmentsService {
  private logger = new Logger(AttachmentsService.name);
  private AWS_S3_FOLDER = process.env.AWS_S3_FOLDER;
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  private s3: AWS.S3 = new AWS.S3({
    endpoint: process.env.AWS_S3_URL,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });
  private AWS_NODE_ENV = process.env.NODE_ENV == 'production' ? 'prod' : 'dev';

  private uploadToS3(file: Buffer, bucket: string, name: string, mimetype: string, id: string) {
    const params = {
      Bucket: bucket,
      Key: `${this.AWS_S3_FOLDER}/${id}/${uuidv()}-${String(name)}`,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    return this.s3.upload(params).promise();
  }

  async uploadSingleFile(id: string, file: Express.Multer.File) {
    const { originalname } = file;
    const response = await this.uploadToS3(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname.replace(/ /g, ''),
      file.mimetype,
      id,
    );

    return { url: response.Location };
  }

  async uploadMultiFiles(id: string, files: Array<Express.Multer.File>) {
    const responsePromise = files.map((file) => {
      const { originalname } = file;

      return this.uploadToS3(file.buffer, this.AWS_S3_BUCKET, originalname.replace(/ /g, ''), file.mimetype, id);
    });

    const responses = await Promise.all(responsePromise);

    return responses.map((response) => response.Location);
  }

  async deleteSingleOrMultiFile(filesUrls: Array<{ url: string }>) {
    try {
      await this.s3
        .deleteObjects(
          {
            Bucket: this.AWS_S3_BUCKET,
            Delete: {
              Objects: filesUrls.map((file) => {
                const imageName = file?.url.split('/');
                return {
                  Key:
                    imageName[imageName.length - 3] +
                    '/' +
                    imageName[imageName.length - 2] +
                    '/' +
                    imageName[imageName.length - 1],
                };
              }),
              Quiet: false,
            },
          },
          (err) => {
            if (err) {
              throw new BadRequestException(ERROR_CODES.err_file_url_not_correct);
            }
          },
        )
        .promise();
      return { success: true, message: 'files successfully deleted' };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      //throw new BadRequestException(ERROR_CODES.err_failed_to_delete_images);
    }
  }

  async listMerchantImages(id: string) {
    try {
      const { Contents: list } = await this.s3
        .listObjects(
          {
            Bucket: this.AWS_S3_BUCKET,
            Delimiter: '/',
            Prefix: `${this.AWS_S3_FOLDER}/${id}/`,
          },
          function (err, data) {
            if (err) throw err;
          },
        )
        .promise();

      if (list?.length > 0) {
        const images = list.map((el) => {
          return {
            url: `https://${this.AWS_S3_BUCKET}.fra1.digitaloceanspaces.com/${el.Key}`,
            // url: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${el.Key}`,
          };
        });
        return images;
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_list_images);
    }
  }

  async listOperationImages() {
    try {
      const { Contents: list } = await this.s3
        .listObjects(
          {
            Bucket: this.AWS_S3_BUCKET,
            Delimiter: '/',
            Prefix: `${this.AWS_S3_FOLDER}/operation/`,
          },
          function (err, data) {
            if (err) throw err;
          },
        )
        .promise();

      if (list.length > 0) {
        const images = list.map((el) => {
          return {
            url: `https://shopex-uploads.fra1.digitaloceanspaces.com/${el.Key}`,
            // url: `https://shopex-uploads.s3.amazonaws.com/${el.Key}`,
          };
        });
        return images;
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_list_images);
    }
  }
}
