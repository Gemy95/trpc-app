import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserSchema, UserRepository } from '../models';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService, UserRepository],
})
export class UserModule {}
