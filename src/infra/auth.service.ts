import { Injectable } from '@nestjs/common';

@Injectable()
export default class AuthService {
  API_KEY: string
  constructor() {
    this.API_KEY = process.env.API_KEY
    console.log(process.env.API_KEY);
    
  }
  validate(apiKey: string) {
    return apiKey === this.API_KEY
  }
}