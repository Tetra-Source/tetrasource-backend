import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {User, UserCredentials, UserRelations} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';


export type Credentials = {
  email: string;
  password: string;
}
export type UserData = {
  email: string;
  password: string
}
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.user') dataSource: UserDataSource,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);

  }

  // async verifyCredentials(credentials: {email: string; password: string}): Promise<User> {
  //   const invalidCredentialsError = 'Invalid email or password.';

  //   // Check if the user exists with the provided email
  //   const foundUser = await this.findOne({where: {email: credentials.email}});
  //   if (!foundUser) {
  //     throw new HttpErrors.Unauthorized(invalidCredentialsError);
  //   }

  //   // Get user credentials
  //   const credentialsFound = await this.findCredentials(foundUser.id);
  //   if (!credentialsFound) {
  //     throw new HttpErrors.Unauthorized(invalidCredentialsError);
  //   }

  //   // Validate password using bcrypt
  //   const passwordMatched = await bcrypt.compare(credentials.password, credentialsFound.password);
  //   if (!passwordMatched) {
  //     throw new HttpErrors.Unauthorized(invalidCredentialsError);
  //   }

  //   return foundUser;
  // }

  async verifyCredentials(credentials: {email: string; password: string}): Promise<User> {
    // Find user by email
    const foundUser = await this.findOne({
      where: {email: credentials.email},
    });

    // If no user is found, throw an error
    if (!foundUser) {
      console.log(foundUser);

      throw new HttpErrors.Unauthorized('In email or password.');
    }

    // Check if passwords match
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    // Return the user if everything is valid
    return foundUser;
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
