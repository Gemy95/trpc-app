import { Resolver, Query, Args } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { UserService } from './user.service';

@Resolver('')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('userInfo')
  getOne(@CurrentUser() user: any) {
    return this.userService.getOne(user);
  }
}
