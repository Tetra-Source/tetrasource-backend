import {UserProfile} from '@loopback/security';
import {TokenService} from '@loopback/authentication';
import {injectable} from '@loopback/core';
import * as jwt from 'jsonwebtoken';

@injectable()
export class JWTService implements TokenService {
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new Error('Error generating token: UserProfile is missing');
    }

    const token = jwt.sign(userProfile, 'your-secret-key', {
      expiresIn: '24h', // Token expiration time
    });
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    const decodedToken = jwt.verify(token, 'your-secret-key');
    return decodedToken as UserProfile;
  }
}
