import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { GroupConfigurationService } from '../../../group-configuration/services/group-configuration/group-configuration.service';
import { GroupService } from '../../../group/services/group.service';
import { CommandConfigurations } from '../../../command-configuration/constants/command-configuration.constants';

@Injectable()
export class HelpHandlerService {
  constructor(
    private readonly _groupConfigService: GroupConfigurationService,
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.HELP)
  async handleHelp(payload: CommandPayload) {
    const { client, groupJid, WaMessage, senderJid } = payload;

    const queryResult = await this._groupConfigService.queryGroupConfiguration([{ $match: { groupJid } }]);

    if (!queryResult?.length) {
      client._wppSocket.sendMessage(
        groupJid,
        {
          text: `Group configuration not found. Please contact the group admin to configure the bot.`,
        },
        { quoted: WaMessage }
      );
    }

    const groupConfig = queryResult[0];
    const getSenderData = await this._groupService.getGroupMember(senderJid, groupJid);
    const isAdmin = getSenderData?.isAdmin;
    let availableCommands = groupConfig.commands;

    if (!isAdmin) {
      availableCommands = groupConfig.commands.filter((command) => !command.adminOnly);
    }

    const commandNames = availableCommands.map((command) => command.name);

    const availableCommandsConfig = CommandConfigurations.filter((command) => commandNames.includes(command.name));

    const message = availableCommandsConfig.map((command) => {
      return `${command.name} - ${command.description}`;
    }).join('\n\n');

    client._wppSocket.sendMessage(
      senderJid,
      {
        text: message,
      },
      { quoted: WaMessage }
    );
  }
}
