import { Test, TestingModule } from '@nestjs/testing';
import { GroupHandlerService } from './group-handler.service';

describe('GroupHandlerService', () => {
  let service: GroupHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupHandlerService],
    }).compile();

    service = module.get<GroupHandlerService>(GroupHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
