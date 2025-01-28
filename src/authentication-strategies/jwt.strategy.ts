import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import {Request} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {UserService} from '../services/user.service';

export class JWTStrategy implements AuthenticationStrategy {
  name: string = 'jwt';

  constructor(
    @inject('services.jwt.service') public jwtService: TokenService,
    @inject('services.user.service') public userService: UserService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);
    if (!token) {
      return undefined;
    }

    const userProfile = await this.jwtService.verifyToken(token);
    return userProfile;
  }

  extractCredentials(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.substring(7);
    }
    return undefined;
  }
}
