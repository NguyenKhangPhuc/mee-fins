import { Global, Module } from '@nestjs/common';
import { QueryService } from './query.service';

@Module({
  providers: [QueryService],
  exports: [QueryService],
})
@Global()
export class QueryModule {}
