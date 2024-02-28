import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import AuthService from './auth.service';

@Injectable()
export default class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'X-API-KEY') {
  constructor(private authService: AuthService) {
    super({
      header: 'X-API-KEY',
      prefix: '',
      credentialsRequired: false
    }, true, async (apiKey: string, done) => {
      if(this.authService.validate(apiKey)) {
        return done(null, true);
      }
      done(new UnauthorizedException(), null)
    });
  }
}