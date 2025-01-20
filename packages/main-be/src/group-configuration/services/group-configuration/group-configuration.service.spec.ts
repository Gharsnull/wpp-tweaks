import { Test, TestingModule } from '@nestjs/testing';
import { GroupConfigurationService } from './group-configuration.service';

describe('GroupConfigurationService', () => {
  let service: GroupConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupConfigurationService],
    }).compile();

    service = module.get<GroupConfigurationService>(GroupConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
