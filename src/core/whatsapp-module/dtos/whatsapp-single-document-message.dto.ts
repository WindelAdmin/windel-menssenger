import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export default class WhatsappSingleDocumentMessageDto {
  @ApiProperty({
    type: String,
    example: 'SQS12E23EWADA21WASASAS45A',
    description: 'Token da conta Whatsapp Bussiness na Meta',
  })
  @IsNotEmpty({ message: 'Campo token é obrigatório.' })
  token: string;

  @ApiProperty({
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
    type: String,
    example: 'Pedido de Venda - 98877',
    description: 'Nome do arquivo a ser enviado',
  })
  @IsNotEmpty({ message: 'Campo filename é obrigatório.' })
  filename: string

  @ApiProperty({
    type: Object,
    example: {
      customerName: 'Nome do cliente',
      typeDocumentName: 'Tipo de documento'
    },
    description: 'Parâmetros do corpo da mensagem',
  })
  @IsNotEmpty({ message: 'Campo parameters é obrigatório.' })
  @Transform(({ value }) => JSON.parse(value))
  parameters: {
    customerName: string,
    typeDocumentName: string
  }
}
