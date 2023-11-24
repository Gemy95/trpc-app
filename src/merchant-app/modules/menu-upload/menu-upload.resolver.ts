import { MenuUploadService } from './menu-upload.service';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MenuUploadFilterDto } from './dto/menu-upload-filter.dto';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMenuUploadDto } from './dto/create-menu-upload.dto';

@Resolver('')
export class MenuUploadResolver {
  constructor(private readonly menuUploadService: MenuUploadService) {}

  @Mutation('createMerchantMenuUpload')
  createMerchantMenuUpload(
    @CurrentUser() user: any,
    @Args('createMenuUploadDto') createMenuUploadDto: CreateMenuUploadDto,
    @Context() context: GraphQLExecutionContext,
  ) {
    return this.menuUploadService.createMerchantMenuUpload(user, createMenuUploadDto);
  }
}
