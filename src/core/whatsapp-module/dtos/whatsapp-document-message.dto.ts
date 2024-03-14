import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export default class WhatsappDocumentMessageDto {
  @ApiPropertyOptional({
    type: String,
    example: 'SQS12E23EWADA21WASASAS45A',
    description: 'Token da conta Whatsapp Bussiness na Meta',
  })
  @IsNotEmpty({ message: 'Campo token é obrigatório.' })
  token: string;

  @ApiPropertyOptional({
    type: String,
    example: '1115599999999999',
    description: 'Número de identificação do telefone da conta Whatsapp Bussiness na Meta',
  })
  @IsNotEmpty({ message: 'Campo senderIdentificationNumber é obrigatório.' })
  senderIdentificationNumber: string;

  @ApiProperty({
    type: String,
    example: '5588888888888',
    description: 'Número de destino da mensagem',
  })
  @IsNotEmpty({ message: 'Campo destinationNumber é obrigatório.' })
  destinationNumber: string;

  @ApiProperty({
    type: Object,
    example: [
       {
      customerName: 'João da Silva',
      typeDocumentName: 'Tipo de documento'
    },
     {
      customerName: 'Nome do cliente',
      typeDocumentName: 'Tipo de documento'
    }
    ],
    description: 'Parâmetros do corpo da mensagem',
  })
  parameters: {
    customerName: string,
    typeDocumentNameList: string[]
  }

  @ApiProperty({
    type: String,
    example: '5588888888888',
    description: 'Número de destino da mensagem',
  })
  @IsOptional({ message: 'Campo destinationNumber é obrigatório.' })
  filenameList?: string[]
}
