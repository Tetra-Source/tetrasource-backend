import {inject} from '@loopback/core';
import {DataObject, DefaultCrudRepository, Options} from '@loopback/repository';
import {ContactDataSource} from '../datasources';
import {Contact, ContactRelations, User} from '../models';

export class ContactRepository extends DefaultCrudRepository<
  Contact,
  typeof Contact.prototype.id,
  ContactRelations
>
{

  async updateById(id: string | undefined, data: DataObject<Contact>, options?: Options): Promise<void> {
    data.updatedAt = new Date()
    return super.updateById(id,data)
  }

  async softDeleteById(id:typeof User.prototype.id):Promise<void>{
    return this.updateById(id,{deletedAt:new Date()})
  }
  constructor(
    @inject('datasources.contact') dataSource: ContactDataSource,
  ) {
    super(Contact, dataSource);
  }
}
