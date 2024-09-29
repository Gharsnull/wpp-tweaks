import { Module } from '@nestjs/common';
import { WhatsappClientController } from './controllers/whatsapp-client.controller';
import { WhatsappGateway } from './gateways/whatsapp-gateway/whatsapp-gateway';

@Module({
  controllers: [WhatsappClientController],
  providers: [WhatsappGateway],
})
export class WhatsappClientModule {}
