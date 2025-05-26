import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;


  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type:'array',
    itemType:'string',
    required:true,
  })
  roles:string[];

  @property({
    type: 'string',
    required: true,
  })
  userName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type:'string',
    required:true,
  })
  number:string
  @property({
    type:'string',
    required:false
  })
  imageUrl:string

  @property({type:'date',defaultFn:'now'})
  createdAt?:Date;

  @property({type:'date'})
  updatedAt?:Date

  @property({type:'date'})
  deletedAt?:Date

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
