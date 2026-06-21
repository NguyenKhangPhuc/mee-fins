import { Module } from '@nestjs/common';
import { FunFactsService } from './fun_facts.service';
import { FunFactsController } from './fun_facts.controller';

@Module({
  providers: [FunFactsService],
  controllers: [FunFactsController],
  exports: [FunFactsService],
})
export class FunFactsModule {}
