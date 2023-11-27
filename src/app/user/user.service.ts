import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  listUsers() {
    return [{ name: 'ali', age: 28, mobile: '01017431767' }];
  }
}
