// src/keys.ts
import {BindingKey} from '@loopback/core';
import {TokenService} from '@loopback/authentication';

export namespace TokenServiceBindings {
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.jwt.service');
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expires.in');
}
