import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() { }
  healthCheck(): string {
    return 'Everything is OK!';
  }
}
