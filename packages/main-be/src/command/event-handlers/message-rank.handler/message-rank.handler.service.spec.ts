import { Test, TestingModule } from '@nestjs/testing';
import { MessageRankHandlerService } from './message-rank.handler.service';

describe('MessageRankHandlerService', () => {
  let service: MessageRankHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRankHandlerService],
    }).compile();

    service = module.get<MessageRankHandlerService>(MessageRankHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
