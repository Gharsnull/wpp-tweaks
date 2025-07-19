import { Test, TestingModule } from '@nestjs/testing';
import { BanAllHandlerService } from './ban-all.handler.service';

describe('BanAllHandlerService', () => {
  let service: BanAllHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanAllHandlerService],
    }).compile();

    service = module.get<BanAllHandlerService>(BanAllHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
