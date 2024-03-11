import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import StorageService from '../storage-module/storage.service';
import WhatsappDocumentMessageDto from './dtos/whatsapp-document-message.dto';
import WhatsappSingleDocumentMessageDto from './dtos/whatsapp-single-document-message.dto';
import WhatsappTextMessageDto from './dtos/whatsapp-text-message.dto';

@Injectable()
export default class WhatsappService {
  constructor(private readonly storageService: StorageService) {}

  createAxios(token: string, sender: string): AxiosInstance {
    return axios.create({
      baseURL: `https://graph.facebook.com/v19.0/${sender}/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async sendText(data: WhatsappTextMessageDto): Promise<any> {
    const message = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: data.destinationNumber,
      type: 'text',
      text: {
        preview_url: true,
        body: data.text,
      },
    };

    try {
      const axios = this.createAxios(
        data.token,
        data.senderIdentificationNumber,
      );
      const response = await axios.post('messages', message);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      throw this.thowHttpException(err);
    }
  }

  async sendDocuments(
    data: WhatsappDocumentMessageDto,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    const documents = await this.storageService.saveFiles(
      'windel-storage',
      files
    );

    const messages = documents.map((doc, index) => {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: data.destinationNumber,
        type: 'document',
        document: {
          link: doc.url,
          caption: data?.captions[index] ? data.captions[index] : doc.filename,
        },
      };
    });

    try {
      const axios = this.createAxios(
        data.token,
        data.senderIdentificationNumber,
      );

      const sendRecursive = async (index: number) => {
        const response = await axios.post('messages', messages[index]);

        if (response.status === 200 && index === documents.length - 1) {
          return response.data;
        }

        sendRecursive(index + 1);
      };

      sendRecursive(0);
    } catch (err) {
      throw this.thowHttpException(err);
    }
  }

  async sendSingleDocument(
    data: WhatsappSingleDocumentMessageDto,
    file: Express.Multer.File,
  ) {

    const message = (
      await this.storageService.saveFiles(
        'windel-storage',
        [file]
      )
    ).map((doc) => {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: data.destinationNumber,
        type: 'document',
        document: {
          link: doc.url,
          caption: data.caption || '',
          filename: data.filename || doc.filename
        },
      };
    })[0];

    const axios = this.createAxios(data.token, data.senderIdentificationNumber);

    try {
      const response = await axios.post('messages', message);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      const errAxios = err as AxiosError;
      throw this.thowHttpException(errAxios);
    }
  }

  thowHttpException(error: AxiosError): Error {
    if (error.response.status === 400) {
      return new BadRequestException('Verifique os dados fornecidos.');
    }

    if (error.response.status === 401) {
      return new UnauthorizedException(
        'O Token ou Número de Identificação do telefone da Meta que foi fornecido são(é) inválido(s)',
      );
    }

    if (error.response.status === 500) {
      return new InternalServerErrorException(
        'Ocorreu algum erro interno no servidor.',
      );
    }
  }
}
