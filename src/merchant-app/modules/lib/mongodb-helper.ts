import { isValidObjectId } from 'mongoose';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export const isObjectId = (id: string) => isValidObjectId(id);

@ValidatorConstraint({ name: 'customText', async: false })
export class IsMongoObjectId implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return isObjectId(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'This is must be an valid mongo object id';
  }
}
