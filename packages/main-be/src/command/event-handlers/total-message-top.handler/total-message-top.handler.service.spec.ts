import { Test, TestingModule } from '@nestjs/testing';
import { TotalMessageTopHandlerService } from './total-message-top.handler.service';

describe('TotalMessageTopHandlerService', () => {
  let service: TotalMessageTopHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TotalMessageTopHandlerService],
    }).compile();

    service = module.get<TotalMessageTopHandlerService>(TotalMessageTopHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
