import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Public } from '../common/decorators';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { AttachmentsService } from './attachments.service';
import { DeleteUrlDto } from './dto/delete-url.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { filesFilter, imagesFilter, pdfFilter } from './helpers';

@Resolver('')
export class AttachmentsResolver {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Public()
  @Mutation('uploadSingleImageAttachment')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imagesFilter,
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadSingleImage(@Args('image') image: Express.Multer.File, @Args('uploadFileDto') uploadFileDto?: UploadFileDto) {
    const id = uploadFileDto?.merchantId ?? 'main';
    return this.attachmentsService.uploadSingleFile(id, image);
  }

  // @Public()
  // @Post('/single-pdf')
  // @ApiResponse({
  //   description: 'This for uploading single pdf',
  //   status: 201,
  // })
  // @UseInterceptors(
  //   FileInterceptor('pdf', {
  //     fileFilter: pdfFilter,
  //     limits: {
  //       fileSize: 25 * 1024 * 1024,
  //     },
  //   }),
  // )
  // uploadSinglePDF(@UploadedFile() file: Express.Multer.File, @Body() uploadFileDto?: UploadFileDto) {
  //   const id = uploadFileDto?.merchantId ?? 'main';
  //   return this.attachmentsService.uploadSingleFile(id, file);
  // }

  // @Public()
  // @Post('/multi-images')
  // @ApiResponse({
  //   description: 'This for uploading multi images',
  //   status: 201,
  // })
  // @UseInterceptors(
  //   FilesInterceptor('images', 50, {
  //     fileFilter: imagesFilter,
  //     limits: { fileSize: 25 * 1024 * 1024 },
  //   }),
  // )
  // uploadImages(@UploadedFiles() files: Array<Express.Multer.File>, @Body() uploadFileDto?: UploadFileDto) {
  //   const id = uploadFileDto?.merchantId ?? 'main';
  //   return this.attachmentsService.uploadMultiFiles(id, files);
  // }

  // @Public()
  // @Post('/multi-pdfs')
  // @ApiResponse({
  //   description: 'This for uploading multi pdfs',
  //   status: 201,
  // })
  // @UseInterceptors(
  //   FilesInterceptor('pdfs', 50, {
  //     fileFilter: pdfFilter,
  //     limits: { fileSize: 25 * 1024 * 1024 },
  //   }),
  // )
  // uploadPdfs(@UploadedFiles() files: Array<Express.Multer.File>, @Body('merchantId') id: string) {
  //   return this.attachmentsService.uploadMultiFiles(id, files);
  // }

  @Public()
  @Mutation('removeAttachment')
  deleteSingleOrMultiFile(@Args('files') files: DeleteUrlDto) {
    const { images } = files;
    return this.attachmentsService.deleteSingleOrMultiFile(images);
  }

  @Public()
  @Query('merchantImagesAttachment')
  async listMerchantImages(@Args('id', ValidateMongoId) id: string) {
    return this.attachmentsService.listMerchantImages(id);
  }

  // @Public()
  // @Post('/mp3')
  // @ApiResponse({
  //   description: 'This for uploading single image',
  //   status: 201,
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     fileFilter: filesFilter,
  //     limits: {
  //       fileSize: 25 * 1024 * 1024,
  //     },
  //   }),
  // )
  // uploadMp3(@UploadedFile() image: Express.Multer.File, @Body() uploadFileDto?: UploadFileDto) {
  //   const id = uploadFileDto?.merchantId ?? 'main';
  //   return this.attachmentsService.uploadSingleFile(id, image);
  // }
}
