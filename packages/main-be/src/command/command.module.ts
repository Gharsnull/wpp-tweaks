import { Module } from '@nestjs/common';
import { PingHandlerService } from './event-handlers/ping.handler/ping.handler.service';
import { CommandService } from './services/command/command.service';
import { GroupConfigurationModule } from '../group-configuration/group-configuration.module';

@Module({
  imports: [GroupConfigurationModule],
  providers: [PingHandlerService, CommandService],
  exports: [CommandService],
})
export class CommandModule {}
