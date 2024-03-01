import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import StorageService from '../storage-module/storage.service';
import WhatsappDocumentMessageDto from './dtos/whatsapp-document-message.dto';
import WhatsappTextMessageDto from './dtos/whatsapp-text-message.dto';
require('dotenv').config();

const WINDEL_WHATSAPP_TOKEN = process.env.WINDEL_WHATSAPP_TOKEN;
const WINDEL_WHATSAPP_NUMBER = process.env.WINDEL_WHATSAPP_NUMBER;

@Injectable()
export default class WhatsappService {
  constructor(private readonly storageService: StorageService) {}

  createAxios(token: string, sender: string): AxiosInstance {
    const whatsappToken = token ? token : WINDEL_WHATSAPP_TOKEN;
    const whatsappSender = sender ? sender : WINDEL_WHATSAPP_NUMBER;

    return axios.create({
      baseURL: `https://graph.facebook.com/v19.0/${whatsappSender}/`,
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
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
      const axios = this.createAxios(data.token, data.identificationSenderNumber);
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
      files,
      'windel-storage',
    );

    const messages = documents.map((doc) => {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: data.destinationNumber,
        type: 'document',
        document: {
          link: doc.url,
          caption: doc.filename,
        },
      };
    });

    try {
      const axios = this.createAxios(data.token, data.identificationSenderNumber);

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
    data: WhatsappDocumentMessageDto,
    file: Express.Multer.File,
  ) {
    const message = (
      await this.storageService.saveFiles([file], 'windel-storage')
    ).map((doc) => {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: data.destinationNumber,
        type: 'document',
        document: {
          link: doc.url,
          caption: data?.caption ? data.caption : doc.filename,
        },
      };
    })[0];

    const axios = this.createAxios(data.token, data.identificationSenderNumber);

    try {
      const response = await axios.post('messages', message);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      throw this.thowHttpException(err);
    }
  }

  thowHttpException(error: AxiosError): Error {
    if (error.response.status === 400) {
      return new BadRequestException(error.message);
    }

    if (error.response.status === 401) {
      return new UnauthorizedException(
        'O Token da Meta que foi fornecido é inválido',
      );
    }

    if (error.response.status === 500) {
      return new InternalServerErrorException(error.message);
    }
  }
}
