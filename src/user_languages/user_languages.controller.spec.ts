import { Test, TestingModule } from '@nestjs/testing';
import { UserLanguagesController } from './user_languages.controller';

describe('UserLanguagesController', () => {
  let controller: UserLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLanguagesController],
    }).compile();

    controller = module.get<UserLanguagesController>(UserLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
