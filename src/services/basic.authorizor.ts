import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
  Authorizer,
} from '@loopback/authorization';
import {UserProfile} from '@loopback/security';
import {Getter, inject, Provider} from '@loopback/core';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository/dist';

export class BasicAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(UserRepository)
    public userRepository:UserRepository
  ) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const user = authorizationCtx.principals[0] as UserProfile;

    if (!user) {
      console.log('User not found in authorization context');
      return AuthorizationDecision.DENY;
    }
    const userData = await this.userRepository.findById(user.id)
    // Get user roles
    const userRoles = userData.roles || [];
    console.log('User:', user);
    console.log('Roles:', userRoles);

    // Check if user has allowed roles
    if (metadata.allowedRoles?.some((role) => userRoles.includes(role))) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}
