import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class WhatsappTextMessageDto {
  @ApiProperty({
    type: String,
    example: 'SQS12E23EWADA21WASASAS45A',
    description: 'Token da conta Whatsapp Bussiness na Meta',
  })
  @IsNotEmpty({ message: 'Campo token é obrigatório.' })
  token: string;

  @ApiProperty({
    type: String,
    example: '5599999999999',
    description: 'Número de identificação do telefone da conta Whatsapp Bussiness na Meta',
  })
  @IsNotEmpty({ message: 'Campo  senderIdentificationNumber é obrigatório.' })
  senderIdentificationNumber: string;

  @ApiProperty({
    type: String,
    example: '5588888888888',
    description: 'Número de destino da mensagem',
  })
  @IsNotEmpty({ message: 'Campo destinationNumber é obrigatório.' })
  destinationNumber: string;

  @ApiProperty({
    type: String,
    example: 'Olá, temos uma oferta para você.',
    description: 'Texto que será enviado para o destinatário',
  })
  @IsNotEmpty({ message: 'Campo text é obrigatório.' })
  text: string;
}
