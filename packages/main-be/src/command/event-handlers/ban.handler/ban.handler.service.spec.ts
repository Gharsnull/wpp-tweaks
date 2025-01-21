import { Test, TestingModule } from '@nestjs/testing';
import { BanHandlerService } from './ban.handler.service';

describe('BanHandlerService', () => {
  let service: BanHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanHandlerService],
    }).compile();

    service = module.get<BanHandlerService>(BanHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
