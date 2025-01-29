import { Module } from '@nestjs/common';
import { PingHandlerService } from './event-handlers/ping.handler/ping.handler.service';
import { CommandService } from './services/command/command.service';
import { GroupConfigurationModule } from '../group-configuration/group-configuration.module';
import { BanHandlerService } from './event-handlers/ban.handler/ban.handler.service';
import { GroupModule } from '../group/group.module';
import { MessageTopHandlerService } from './event-handlers/message-top.handler/message-top.handler.service';
import { MessageRankHandlerService } from './event-handlers/message-rank.handler/message-rank.handler.service';
import { MuteHandlerService } from './event-handlers/mute.handler/mute.handler.service';
import { HelpHandlerService } from './event-handlers/help.handler/help.handler.service';
import { MimicHandlerService } from './event-handlers/mimic.handler/mimic.handler.service';

@Module({
  imports: [GroupConfigurationModule, GroupModule],
  providers: [PingHandlerService, CommandService, BanHandlerService, MessageTopHandlerService, MessageRankHandlerService, MuteHandlerService, HelpHandlerService, MimicHandlerService],
  exports: [CommandService],
})
export class CommandModule {}
