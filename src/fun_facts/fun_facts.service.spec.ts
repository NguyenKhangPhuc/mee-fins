import { Test, TestingModule } from '@nestjs/testing';
import { FunFactsService } from './fun_facts.service';

describe('FunFactsService', () => {
  let service: FunFactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunFactsService],
    }).compile();

    service = module.get<FunFactsService>(FunFactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
