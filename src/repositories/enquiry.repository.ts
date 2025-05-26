import {inject} from '@loopback/core';
import {DataObject, DefaultCrudRepository, Options} from '@loopback/repository';
import {EnquiryDataSource} from '../datasources';
import {Contact, Enquiry, EnquiryRelations, User} from '../models';

export class EnquiryRepository extends DefaultCrudRepository<
  Enquiry,
  typeof Enquiry.prototype.id,
  EnquiryRelations
> {
  async updateById(id: string | undefined, data: DataObject<Enquiry>, options?: Options): Promise<void> {
      data.updatedAt = new Date()
      return super.updateById(id,data)
    }

  async softDeleteById(id:typeof User.prototype.id):Promise<void>{
      return this.updateById(id,{deletedAt:new Date()})
  }
  
  constructor(
    @inject('datasources.enquiry') dataSource: EnquiryDataSource,
  ) {
    super(Enquiry, dataSource);
  }
}
