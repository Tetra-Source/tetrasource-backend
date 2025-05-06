import {securityId, UserProfile} from '@loopback/security';
import {TokenService} from '@loopback/authentication';
import {inject, injectable} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {HttpErrors} from '@loopback/rest/dist';
import {TokenServiceBindings} from '@loopback/authentication-jwt/dist';

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
  ) {}
  async generateToken(userProfile: UserProfile): Promise<string> {

    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error while generating token');
    }
    
   const token = jwt.sign(userProfile, this.jwtSecret, {
      expiresIn:'24h',
    });

    return token
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Error verifying token: Token is null');
    }

    let userProfile: UserProfile;

    try {
      const decodedToken = jwt.verify(token, this.jwtSecret) as UserProfile;
      userProfile = decodedToken;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`);
    }
    console.log('User Profile',userProfile);

    return userProfile;
  }
}
