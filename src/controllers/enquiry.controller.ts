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
} from '@loopback/rest';
import {Enquiry} from '../models';
import {EnquiryRepository} from '../repositories';
import {EmailService} from '../services';
import {inject} from '@loopback/context/dist';

export class EnquiryController {
  constructor(
    @repository(EnquiryRepository)
    public enquiryRepository : EnquiryRepository,
    @inject('services.EmailService') public emailService:EmailService
  ) {}

  @post('/enquiries')
  @response(200, {
    description: 'Enquiry model instance',
    content: {'application/json': {schema: getModelSchemaRef(Enquiry)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enquiry, {
            title: 'NewEnquiry',
            exclude: ['id'],
          }),
        },
      },
    })
    enquiry: Omit<Enquiry, 'id'>,
  ): Promise<Enquiry> {
    const savedEnquiry = await this.enquiryRepository.create(enquiry);
    const content ={
      name:savedEnquiry.name,
      email:savedEnquiry.email,
      manufacturer:savedEnquiry.manufacturer,
      partNumber:savedEnquiry.partNumber,
      company:savedEnquiry.company,
      quantity:savedEnquiry.quantity,
      mobile:savedEnquiry.number
    }
    this.emailService.sendEmail('emailTemplates',content)
    return savedEnquiry
  }

  @get('/enquiries/count')
  @response(200, {
    description: 'Enquiry model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Enquiry) where?: Where<Enquiry>,
  ): Promise<Count> {
    return this.enquiryRepository.count(where);
  }

  @get('/enquiries')
  @response(200, {
    description: 'Array of Enquiry model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Enquiry, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Enquiry) filter?: Filter<Enquiry>,
  ): Promise<Enquiry[]> {
    return this.enquiryRepository.find(filter);
  }

  @patch('/enquiries')
  @response(200, {
    description: 'Enquiry PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enquiry, {partial: true}),
        },
      },
    })
    enquiry: Enquiry,
    @param.where(Enquiry) where?: Where<Enquiry>,
  ): Promise<Count> {
    return this.enquiryRepository.updateAll(enquiry, where);
  }

  @get('/enquiries/{id}')
  @response(200, {
    description: 'Enquiry model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Enquiry, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Enquiry, {exclude: 'where'}) filter?: FilterExcludingWhere<Enquiry>
  ): Promise<Enquiry> {
    return this.enquiryRepository.findById(id, filter);
  }

  @patch('/enquiries/{id}')
  @response(204, {
    description: 'Enquiry PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enquiry, {partial: true}),
        },
      },
    })
    enquiry: Enquiry,
  ): Promise<void> {
    await this.enquiryRepository.updateById(id, enquiry);
  }

  @put('/enquiries/{id}')
  @response(204, {
    description: 'Enquiry PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() enquiry: Enquiry,
  ): Promise<void> {
    await this.enquiryRepository.replaceById(id, enquiry);
  }

  @del('/enquiries/{id}')
  @response(204, {
    description: 'Enquiry DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.enquiryRepository.deleteById(id);
  }
}
