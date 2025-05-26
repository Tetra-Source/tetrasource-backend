import {inject} from '@loopback/core';
import {DataObject, DefaultCrudRepository, Options} from '@loopback/repository';
import {ProductDataSource} from '../datasources';
import {Enquiry, Product, ProductRelations, User} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  async updateById(id: string | undefined, data: DataObject<Enquiry>, options?: Options): Promise<void> {
        data.updatedAt = new Date()
        return super.updateById(id,data)
      }

    async softDeleteById(id:typeof User.prototype.id):Promise<void>{
        return this.updateById(id,{deletedAt:new Date()})
  }

  constructor(
    @inject('datasources.product') dataSource: ProductDataSource,
  ) {
    super(Product, dataSource);
  }
}
