import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Git Hub Actions ON With Auto-Deploy AWS!';
  }
}
