import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { WhatsappClientController } from './controllers/whatsapp-client.controller';
import { ConnectionHandlerService } from './event-handlers/connection-handler/connection-handler.service';
import { GroupHandlerService } from './event-handlers/group-handler/group-handler.service';
import { MessageHandlerService } from './event-handlers/message-handler/message-handler.service';
import { WhatsappClientService } from './services/whatsapp-client/whatsapp-client.service';
import { GroupConfigurationModule } from '../group-configuration/group-configuration.module';
import { CommandModule } from '../command/command.module';

@Module({
  imports: [GroupModule, GroupConfigurationModule, CommandModule],
  controllers: [WhatsappClientController],
  providers: [WhatsappClientService, ConnectionHandlerService, MessageHandlerService, GroupHandlerService],
})
export class WhatsappClientModule {}
