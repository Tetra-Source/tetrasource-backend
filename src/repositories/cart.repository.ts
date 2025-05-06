import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CartDataSource} from '../datasources';
import {Cart, CartRelations} from '../models';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {
  constructor(
    @inject('datasources.cart') dataSource: CartDataSource,
  ) {
    super(Cart, dataSource);
  }
}
