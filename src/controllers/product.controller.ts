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
  Request,
  RestBindings,
  Response,
} from '@loopback/rest';
import {Product} from '../models';
import {ProductRepository} from '../repositories';
import multer from 'multer';
import path from 'path';
import {inject} from '@loopback/context/dist';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  },
});


export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Product> {
    return new Promise((resolve, reject) => {
      upload.single('imageUrl')(request, response, async err => {
        if (err) return reject(err);

        const {productName, category, price, description, partNumber} =
          request.body;

        const imagePath = request.file?.path.replace(/\\/g, '/') ?? '';

        console.log('Image Path', imagePath);

        const productData = {
          productName,
          category,
          price,
          imageUrl: imagePath,
          description,
          partNumber,
        };

        try {
          const newUser = await this.productRepository.create(productData);
          resolve(newUser);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      upload.single('imageUrl')(request, response, async err => {
        if (err) return reject(err);

        const {productName, category, price, description, partNumber} =
          request.body;

        const updateData: Partial<Product> = {
          productName,
          category,
          price,
          description,
          partNumber,
        };

        console.log('File:', request.file);

        // Add image path only if a file was uploaded
        if (request.file?.path) {
          updateData.imageUrl = request.file?.path.replace(/\\/g, '/') ?? '';
        }

        try {
          await this.productRepository.updateById(id, updateData);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
