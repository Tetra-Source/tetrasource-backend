import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Request,
  HttpErrors,
  Response,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {hash, genSalt} from 'bcryptjs';
import {authenticate} from '@loopback/authentication';
import {validateCredentials} from '../services/validator';
import {inject} from '@loopback/core';
import {UserService} from '../services/user.service';
import {JWTService} from '../services/jwt.service';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {authorize} from '@loopback/authorization/dist';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {EncodingService} from '../services/encoding.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `user-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('services.UserService')
    private userService: UserService,
    @inject('services.JWTService')
    private jwtService: JWTService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('services.EncodingService')
    private encodingService: EncodingService,
  ) {}

  @authenticate('jwt')
  @post('/users/register')
  async register(
    @requestBody()
    userData: {
      username: string;
      email: string;
      password: string;
    },
  ): Promise<User> {
    // Hash the password before saving
    const passwordHash = await hash(userData.password, await genSalt());

    // Create a new user in the database
    const user = await this.userRepository.create({
      userName: userData.username,
      email: userData.email,
    });

    // Store the hashed password in the user credentials
    await this.userRepository.userCredentials(user.id).create({
      password: passwordHash,
    });

    return user;
  }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single('imageUrl')(request, response, async err => {
        if (err) return reject(err);

        const {firstName, lastName, userName, email, password, number, roles} =
          request.body;

        const imagePath = request.file?.path ?? '';

        const userData = {
          firstName,
          lastName,
          userName,
          email,
          password: await this.passwordHasher.hashPassword(password),
          number,
          roles,
          imageUrl: imagePath,
        };

        try {
          validateCredentials(email, password);
          const newUser = await this.userRepository.create(userData);
          resolve(newUser);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @post('/login')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async login(
    @requestBody() credentials: {email: string; password: string},
  ): Promise<{token: string}> {
    // Verify the user's credentials
    const user = await this.userRepository.verifyCredentials(credentials);

    // Generate a JWT token
    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);
    console.log('token', token);

    return {token};
  }

  @get('/me')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  @authenticate('jwt')
  async getCurrentUser(
    @inject(SecurityBindings.USER) userProfile: UserProfile,
  ): Promise<User> {
    const userId = userProfile[securityId];
    const currentUserProfile = this.userRepository.findById(userId);
    if ((await currentUserProfile).email) {
      const userEmail = (await currentUserProfile).email;
      (await currentUserProfile).email =
        this.encodingService.encodingToBase64(userEmail);
    }
    console.log('ReturnData:', currentUserProfile);
    return currentUserProfile;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['superAdmin'],
    voters: ['authorizationProviders.basic-authorizer'],
  })
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      upload.single('imageUrl')(request, response, async err => {
        if (err) return reject(err);

        const {firstName, lastName, userName, email, number,} =
          request.body;
        const imagePath = request.file?.path;

        const updateData: any = {
          firstName,
          lastName,
          userName,
          email,
          number,
        };

        if (imagePath) {
          updateData.imageUrl = imagePath;
        }
        console.log('edit data',updateData);

        try {
          await this.userRepository.updateById(id, updateData);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
