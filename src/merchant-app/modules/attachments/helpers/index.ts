import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';

import { ERROR_CODES } from '../../../../libs/utils/src';

// const imagesExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.jif', '.jfif', '.pjp', '.pjpeg', '.bmp', '.tif', '.tiff'];
const imagesExtensions = ['.png', '.jpg', '.jpeg', '.apng'];

const filesExtensions = ['.mp3'];

export const imagesFilter = (req, file: Express.Multer.File, callback) => {
  const ext = path.extname(file.originalname);

  // if (!imagesExtensions.includes(ext.toLowerCase())) {
  //   callback(ERROR_CODES.err_only_images_are_allowed);
  // }

  if (!imagesExtensions.includes(ext.toLowerCase())) {
    return callback(new HttpException(ERROR_CODES.err_only_images_are_allowed, HttpStatus.BAD_REQUEST), false);
  }

  if (req?.headers?.['content-length'] / (1024 * 1024) > 5) {
    return callback(new HttpException(ERROR_CODES.err_max_size_exceeded_for_file, HttpStatus.BAD_REQUEST), false);
  }

  callback(null, true);
};

export const filesFilter = (_req, file: Express.Multer.File, callback) => {
  const ext = path.extname(file.originalname);

  if (!filesExtensions.includes(ext.toLowerCase())) {
    callback('Only mp3 are allowed');
  }

  callback(null, true);
};

export const pdfFilter = (_req, file: Express.Multer.File, callback) => {
  const ext = path.extname(file.originalname);

  if (ext.toLowerCase() !== '.pdf') {
    callback('Only PDFs are allowed');
  }

  callback(null, true);
};
