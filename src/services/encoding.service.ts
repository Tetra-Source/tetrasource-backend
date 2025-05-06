import {injectable} from '@loopback/context/dist';

@injectable()

export class EncodingService {
  constructor() {}

  encodingToBase64(value:string):string{
    return Buffer.from(value).toString('base64');
  }
  decodingFromBase64(value:string):string{
    return Buffer.from(value).toString('ascii');
  }
}
