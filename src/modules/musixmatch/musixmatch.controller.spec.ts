import { Test, TestingModule } from '@nestjs/testing';
import { MusixmatchController } from './musixmatch.controller';

describe('MusixmatchController', () => {
  let controller: MusixmatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusixmatchController],
    }).compile();

    controller = module.get<MusixmatchController>(MusixmatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
