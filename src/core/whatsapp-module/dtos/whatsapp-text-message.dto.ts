import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export default class WhatsappTextMessageDto {
  @ApiPropertyOptional({
    type: String,
    example: 'SQS12E23EWADA21WASASAS45A',
    description: 'Token da conta Whatsapp Bussiness na Meta',
  })
  @IsOptional()
  token: string;

  @ApiPropertyOptional({
    type: String,
    example: '5599999999999',
    description: 'Número de identificação do telefone da conta Whatsapp Bussiness na Meta',
  })
  @IsOptional()
  identificationSenderNumber: string;

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
