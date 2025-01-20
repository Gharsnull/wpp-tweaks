import { Test, TestingModule } from '@nestjs/testing';
import { PingHandlerService } from './ping.handler.service';

describe('PingHandlerService', () => {
  let service: PingHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingHandlerService],
    }).compile();

    service = module.get<PingHandlerService>(PingHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
