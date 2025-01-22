import { Test, TestingModule } from '@nestjs/testing';
import { MessageTopHandlerService } from './message-top.handler.service';

describe('MessageTopHandlerService', () => {
  let service: MessageTopHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageTopHandlerService],
    }).compile();

    service = module.get<MessageTopHandlerService>(MessageTopHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
