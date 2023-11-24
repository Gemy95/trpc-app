import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { AttachmentsService } from './attachments.service';
import { DeleteUrlDto } from './dto/delete-url.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { filesFilter, imagesFilter, pdfFilter } from './helpers';

@Controller('attachments')
@ApiTags(swaggerResources.Attachments)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Public()
  @Post('/single-image')
  @ApiResponse({
    description: 'This for uploading single image',
    status: 201,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
        merchantId: {
          type: 'string',
          nullable: true,
        },
        isOperation: {
          type: 'boolean',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imagesFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadSingleImage(@UploadedFile() image: Express.Multer.File, @Body() uploadFileDto?: UploadFileDto) {
    const id = uploadFileDto?.merchantId
      ? uploadFileDto?.merchantId
      : uploadFileDto?.isOperation
      ? 'operation'
      : 'main';
    return this.attachmentsService.uploadSingleFile(id, image);
  }

  @Public()
  @Post('/single-pdf')
  @ApiResponse({
    description: 'This for uploading single pdf',
    status: 201,
  })
  @UseInterceptors(
    FileInterceptor('pdf', {
      fileFilter: pdfFilter,
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadSinglePDF(@UploadedFile() file: Express.Multer.File, @Body() uploadFileDto?: UploadFileDto) {
    // const id = uploadFileDto?.merchantId ?? 'main';
    const id = uploadFileDto?.merchantId
      ? uploadFileDto?.merchantId
      : uploadFileDto?.isOperation
      ? 'operation'
      : 'main';
    return this.attachmentsService.uploadSingleFile(id, file);
  }

  @Public()
  @Post('/multi-images')
  @ApiResponse({
    description: 'This for uploading multi images',
    status: 201,
  })
  @UseInterceptors(
    FilesInterceptor('images', 50, {
      fileFilter: imagesFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImages(@UploadedFiles() files: Array<Express.Multer.File>, @Body() uploadFileDto?: UploadFileDto) {
    const id = uploadFileDto?.merchantId ?? 'main';
    return this.attachmentsService.uploadMultiFiles(id, files);
  }

  @Public()
  @Post('/multi-pdfs')
  @ApiResponse({
    description: 'This for uploading multi pdfs',
    status: 201,
  })
  @UseInterceptors(
    FilesInterceptor('pdfs', 50, {
      fileFilter: pdfFilter,
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  uploadPdfs(@UploadedFiles() files: Array<Express.Multer.File>, @Body('merchantId') id: string) {
    return this.attachmentsService.uploadMultiFiles(id, files);
  }

  @Public()
  @ApiResponse({
    description: 'Delete Files from S3',
  })
  @Delete('remove')
  deleteSingleOrMultiFile(@Body() files: DeleteUrlDto) {
    const { images } = files;
    return this.attachmentsService.deleteSingleOrMultiFile(images);
  }

  @Public()
  @ApiParam({
    type: 'string',
    name: 'id',
    required: true,
  })
  @Get('merchant/:id/images')
  listMerchantImages(@Param('id') id: string) {
    return this.attachmentsService.listMerchantImages(id);
  }

  @Public()
  @Get('operation/images')
  listOperationImages() {
    return this.attachmentsService.listOperationImages();
  }

  @Public()
  @Post('/mp3')
  @ApiResponse({
    description: 'This for uploading single image',
    status: 201,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: filesFilter,
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadMp3(@UploadedFile() image: Express.Multer.File, @Body() uploadFileDto?: UploadFileDto) {
    const id = uploadFileDto?.merchantId ?? 'main';
    return this.attachmentsService.uploadSingleFile(id, image);
  }
}
