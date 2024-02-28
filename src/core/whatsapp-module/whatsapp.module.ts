import { Module } from '@nestjs/common';
import StorageModule from '../storage-module/storage.module';
import WhatsappController from './whatsapp.controller';
import WhatsappService from './whatsapp.service';

@Module({
  imports: [StorageModule],
  providers: [WhatsappService],
  controllers: [WhatsappController],
})
export default class WhatsappModule {}
