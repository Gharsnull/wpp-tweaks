import { Test, TestingModule } from '@nestjs/testing';
import { CommandConfigurationService } from './command-configuration.service';

describe('CommandConfigurationService', () => {
  let service: CommandConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandConfigurationService],
    }).compile();

    service = module.get<CommandConfigurationService>(CommandConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
