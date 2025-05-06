import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'cart',
  connector: 'mongodb',
  url: 'mongodb+srv://tetrasolutionsoftware:tetra123@cluster0.ffsmenm.mongodb.net/cart?retryWrites=true&w=majority&appName=Cluster0',
  database: 'cart',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CartDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'cart';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.cart', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
