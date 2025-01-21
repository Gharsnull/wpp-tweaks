import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GroupConfigurationService } from '../../../group-configuration/services/group-configuration/group-configuration.service';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { GroupCommandOverride } from '../../../group-configuration/models/group-configuration.model';

@Injectable()
export class CommandService {
  private readonly _logger = new Logger(CommandService.name);
  constructor(
    private readonly _eventEmitter: EventEmitter2,
    private readonly _groupConfigurationService: GroupConfigurationService,
  ) { }

  async handleCommand(command: Commands, payload: CommandPayload) {
    this._logger.log(`Received command: ${command}`);
    const {
      groupJid,
      WaMessage,
      client,
    } = payload;
    const commandGroupConfiguration = await this.getGroupCommand(groupJid, command);

    let error;

    if (!commandGroupConfiguration) {
      error = 'Command not found';
    } else if (!commandGroupConfiguration.enabled) {
      error = 'Command is disabled';
    }

    if (error) {
      this.replyCommandError(client, groupJid, WaMessage, error);
      return;
    }

    this._eventEmitter.emit(command, payload);
  }

  private async getGroupCommand(groupJid: string, command: Commands): Promise<GroupCommandOverride> {
    const pipeline = [
      { $match: { groupJid } },
      {
        $project: {
          commands: {
            $filter: {
              input: '$commands',
              as: 'cmd',
              cond: { $eq: ['$$cmd.name', command] },
            },
          },
        },
      },
    ];

  const result = await this._groupConfigurationService.queryGroupConfiguration(pipeline);

return result[0]?.commands?.[0];
  }

  private replyCommandError(client, groupJid, WaMessage, error) {
  client._wppSocket.sendMessage(
    groupJid,
    { text: `Error: ${error}` },
    { quoted: WaMessage }
  );
}
}
