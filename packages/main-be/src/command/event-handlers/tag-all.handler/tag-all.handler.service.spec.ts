import { Test, TestingModule } from '@nestjs/testing';
import { TagAllHandlerService } from './tag-all.handler.service';

describe('TagAllHandlerService', () => {
  let service: TagAllHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagAllHandlerService],
    }).compile();

    service = module.get<TagAllHandlerService>(TagAllHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
