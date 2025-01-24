import { Test, TestingModule } from '@nestjs/testing';
import { MuteHandlerService } from './mute.handler.service';

describe('MuteHandlerService', () => {
  let service: MuteHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuteHandlerService],
    }).compile();

    service = module.get<MuteHandlerService>(MuteHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
