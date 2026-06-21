import { Test, TestingModule } from '@nestjs/testing';
import { FunFactsController } from './fun_facts.controller';

describe('FunFactsController', () => {
  let controller: FunFactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunFactsController],
    }).compile();

    controller = module.get<FunFactsController>(FunFactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
