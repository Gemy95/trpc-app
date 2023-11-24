import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { ERROR_CODES } from '../../../../libs/utils/src';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      throw new BadRequestException(ERROR_CODES.err_must_be_mongo_id.replace('{{item}}', `${metadata.data}`));
    }
    throw new BadRequestException(ERROR_CODES.err_must_be_mongo_id.replace('{{item}}', `${metadata.data}`));
  }
}
