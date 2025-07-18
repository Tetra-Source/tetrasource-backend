import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
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
  productName: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  imageUrl: string;

  @property({
    type:'string',
    required:true
  })
  description: string

  @property({
    type:'string',
    required:true
  })
  partNumber: string

  @property({type: 'date', defaultFn: 'now'})
  createdAt?: Date;
  @property({type: 'date'})
  updatedAt?: Date;
  @property({type: 'date'})
  deletedAt?: Date;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
