import { Test, TestingModule } from '@nestjs/testing';
import { ResetMessageCountHandlerService } from './reset-message-count.handler.service';

describe('ResetMessageCountHandlerService', () => {
  let service: ResetMessageCountHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetMessageCountHandlerService],
    }).compile();

    service = module.get<ResetMessageCountHandlerService>(ResetMessageCountHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
