import { Scalar } from '@nestjs/graphql';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GraphQLUpload = require('graphql-upload/Upload.mjs');

@Scalar('Upload')
export class Upload {
  description = 'File upload scalar type';

  parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
