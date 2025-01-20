import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappClientController } from './whatsapp-client/whatsapp-client.controller';

describe('WhatsappClientController', () => {
  let controller: WhatsappClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappClientController],
    }).compile();

    controller = module.get<WhatsappClientController>(WhatsappClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
