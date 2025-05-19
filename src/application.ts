import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {JWTStrategy} from './authentication-strategies/jwt.strategy';
import {PasswordHasherBindings} from './keys';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {UserDataSource} from './datasources';
import {AuthorizationComponent} from '@loopback/authorization';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {JWTService} from './services/jwt.service';
import {TokenServiceBindings} from './services/key';
import {BasicAuthorizationProvider} from './services/basic.authorizor';
import {EmailService} from './services';


export {ApplicationConfig};

export class TetraApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.dataSource(UserDataSource);
    this.setUpBindings();
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to('your-secret-key'); // Replace with your secret key
    // Set up the custom sequence
    this.bind('authorizationProviders.basic-authorizer').toProvider(
      BasicAuthorizationProvider,
    );
    this.static('/uploads', path.join(__dirname, '../uploads'));
    this.sequence(MySequence);
    this.bind('services.EmailService').toClass(EmailService);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setUpBindings():void{
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
  }
}
