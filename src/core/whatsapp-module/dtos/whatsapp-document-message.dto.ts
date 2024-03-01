import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export default class WhatsappDocumentMessageDto {
  @ApiPropertyOptional({
    type: String,
    example: 'SQS12E23EWADA21WASASAS45A',
    description: 'Token da conta Whatsapp Bussiness na Meta',
  })
  @IsOptional()
  token: string;

  @ApiPropertyOptional({
    type: String,
    example: '1115599999999999',
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

  @ApiPropertyOptional({
    type: String,
    example: 'Pedido Nº 2',
    description: 'Legenda para o arquivo',
  })
  @IsOptional()
  caption?: string;
}
