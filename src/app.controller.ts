import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import ApiKeyAuthGuard from './infra/apykey-auth.guard';
const accountSid = 'ACcafe3dc64a0eb94e3dd1d7497d6e2650';
const authToken = '130573a642c69c348e90d3628485c2dd';
const client = require('twilio')(accountSid, authToken);

@UseGuards(ApiKeyAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {

    client.messages
        .create({
            body: 'Olá mundo, deu certo',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+559885106266'
        })
        .then(message => console.log(message.sid))
        .done();
    return this.appService.getHello();
  }
}
