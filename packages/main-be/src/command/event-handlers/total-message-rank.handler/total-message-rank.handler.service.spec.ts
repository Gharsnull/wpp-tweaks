import { Test, TestingModule } from '@nestjs/testing';
import { TotalMessageRankHandlerService } from './total-message-rank.handler.service';

describe('TotalMessageRankHandlerService', () => {
  let service: TotalMessageRankHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalMessageRankHandlerService],
    }).compile();

    service = module.get<TotalMessageRankHandlerService>(TotalMessageRankHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
