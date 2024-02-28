import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import WhatsappModule from './core/whatsapp-module/whatsapp.module';
import { AuthModule } from './infra/auth.module';

@Module({
  imports: [AuthModule, WhatsappModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
