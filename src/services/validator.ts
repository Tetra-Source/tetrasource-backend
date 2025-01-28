// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors} from '@loopback/rest';
import isemail from 'isemail';
import { User } from '../models';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(email:string,password:string) {
  // Validate email
  if (!isemail.validate(email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (!password || password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}

export function validateKeyPassword(keyAndPassword: any) {
  // Validate Password Length
  if (!keyAndPassword.password || keyAndPassword.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }

  if (keyAndPassword.password !== keyAndPassword.confirmPassword) {
    throw new HttpErrors.UnprocessableEntity(
      'password and confirmation password do not match',
    );
  }

  if (
    keyAndPassword.resetKey.length === 0 ||
    keyAndPassword.resetKey.trim() === ''
  ) {
    throw new HttpErrors.UnprocessableEntity('reset key is mandatory');
  }
}
