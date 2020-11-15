import { Test, TestingModule } from '@nestjs/testing';
import { MusixmatchService } from './musixmatch.service';

describe('MusixmatchService', () => {
  let service: MusixmatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusixmatchService],
    }).compile();

    service = module.get<MusixmatchService>(MusixmatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
