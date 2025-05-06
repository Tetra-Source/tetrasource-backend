import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {UserProfile, securityId} from '@loopback/security';
import {User} from '../models';
import {compare} from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  convertToUserProfile(user: User): UserProfile {
    console.log('user data from service',user);
    
    return {
      [securityId]: user.id!,
      name: user.userName,
      email: user.email,
      id: user.id!,
      roles: user.roles,
    };
  }
}
