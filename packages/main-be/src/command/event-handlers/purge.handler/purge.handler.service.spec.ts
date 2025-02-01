import { Test, TestingModule } from '@nestjs/testing';
import { PurgeHandlerService } from './purge.handler.service';

describe('PurgeHandlerService', () => {
  let service: PurgeHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurgeHandlerService],
    }).compile();

    service = module.get<PurgeHandlerService>(PurgeHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
