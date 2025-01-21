import { Module } from '@nestjs/common';
import { PingHandlerService } from './event-handlers/ping.handler/ping.handler.service';
import { CommandService } from './services/command/command.service';
import { GroupConfigurationModule } from '../group-configuration/group-configuration.module';
import { BanHandlerService } from './event-handlers/ban.handler/ban.handler.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [GroupConfigurationModule, GroupModule],
  providers: [PingHandlerService, CommandService, BanHandlerService],
  exports: [CommandService],
})
export class CommandModule {}
