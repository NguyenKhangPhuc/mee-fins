import { Test, TestingModule } from '@nestjs/testing';
import { UserLanguagesService } from './user_languages.service';

describe('UserLanguagesService', () => {
  let service: UserLanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLanguagesService],
    }).compile();

    service = module.get<UserLanguagesService>(UserLanguagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
