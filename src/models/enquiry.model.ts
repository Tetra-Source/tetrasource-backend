import {Entity, model, property} from '@loopback/repository';

@model()
export class Enquiry extends Entity {
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
  manufacturer: string;

  @property({
    type: 'string',
    required: true,
  })
  partNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  company: string;

  @property({
    type: 'number',
    required: true,
  })
  number: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;


  constructor(data?: Partial<Enquiry>) {
    super(data);
  }
}

export interface EnquiryRelations {
  // describe navigational properties here
}

export type EnquiryWithRelations = Enquiry & EnquiryRelations;
