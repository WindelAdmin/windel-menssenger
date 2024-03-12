import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import ApiKeyAuthGuard from 'src/infra/apykey-auth.guard';
import WhatsappDocumentMessageDto from './dtos/whatsapp-document-message.dto';
import WhatsappSingleDocumentMessageDto from './dtos/whatsapp-single-document-message.dto';
import WhatsappTextMessageDto from './dtos/whatsapp-text-message.dto';
import WhatsappService from './whatsapp.service';

@UseGuards(ApiKeyAuthGuard)
@Controller('whatsapp')
export default class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('/text')
  sendTextMessage(@Body() data: WhatsappTextMessageDto) {
    return this.whatsappService.sendText(data);
  }

  @Post('/documents')
  @UseInterceptors(FilesInterceptor('files'))
  sendDocumentsMessage(
    @Body() data: WhatsappDocumentMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.whatsappService.sendDocuments(data, files);
  }

  @Post('/single-document')
  @UseInterceptors(FilesInterceptor('files'))
  sendSingleDocumentMessage(
    @Body() data: WhatsappSingleDocumentMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.whatsappService.sendSingleDocument(data, files[0]);
  }
}
