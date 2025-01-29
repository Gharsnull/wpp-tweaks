import { Test, TestingModule } from '@nestjs/testing';
import { MimicHandlerService } from './mimic.handler.service';

describe('MimicHandlerService', () => {
  let service: MimicHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MimicHandlerService],
    }).compile();

    service = module.get<MimicHandlerService>(MimicHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
