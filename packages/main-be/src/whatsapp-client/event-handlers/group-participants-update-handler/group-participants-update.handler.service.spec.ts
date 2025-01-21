import { Test, TestingModule } from '@nestjs/testing';
import { GroupParticipantsUpdateHandlerService } from './group-participants-update.handler.service';

describe('GroupParticipantsUpdateHandlerService', () => {
  let service: GroupParticipantsUpdateHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupParticipantsUpdateHandlerService],
    }).compile();

    service = module.get<GroupParticipantsUpdateHandlerService>(GroupParticipantsUpdateHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
