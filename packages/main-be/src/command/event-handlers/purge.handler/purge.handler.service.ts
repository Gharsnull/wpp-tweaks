import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';
import { GroupService } from '../../../group/services/group.service';
import { PipelineStage } from 'mongoose';
import { GroupCommandOverride } from '../../../group-configuration/models/group-configuration.model';
import { PurgeCommandSettings } from './interfaces/purge.handler.interfaces';
import { WAMessage } from '@whiskeysockets/baileys';
import { ClientHandler } from '../../../whatsapp-client/classes/client-handler';

@Injectable()
export class PurgeHandlerService implements CommandHandler {
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.PURGE)
  async handle(payload: CommandPayload) {
    const {
      groupJid,
      WaMessage,
      commandConfiguration,
      client,
    } = payload;

    const purgeconfiguration = commandConfiguration as unknown as GroupCommandOverride<PurgeCommandSettings>;

    if (!purgeconfiguration.settings || isNaN(purgeconfiguration.settings.maxBanCount) || isNaN(purgeconfiguration.settings.minMessageCount)) {
      await this.notifyMissingSettings(client, groupJid, WaMessage);
      return;
    }

    const { maxBanCount, minMessageCount } = purgeconfiguration.settings;
    const groupMembers = await this.queryGroupMembers(groupJid, maxBanCount, minMessageCount);

    if (groupMembers.length === 0) {
      const message = `No members found to purge`;
      client._wppSocket.sendMessage(groupJid, { text: message }, { quoted: WaMessage });
      return;
    }

    const memberJids = groupMembers.map(member => member.jid);

    await client._wppSocket.groupParticipantsUpdate(groupJid, memberJids, 'remove');
    await client._wppSocket.sendMessage(groupJid, { text: `Purged ${groupMembers.length} members` }, { quoted: WaMessage });

  }

  private queryGroupMembers(groupJid: string, limit: number, minMessageCount: number) {
    const now = new Date();
    const monthAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
    const pipeline: PipelineStage[] = [
      {
        $match: {
          groupJid: groupJid,
          messagesCount: { $lt: minMessageCount },
          active: true,
          isAdmin: false,
          joinedAt: { $lte: monthAgo }
        }
      },
      {
        $limit: limit,
      }
    ];
    return this._groupService.queryGroupMembers(pipeline);
  }

  private async notifyMissingSettings(client: ClientHandler, groupJid: string, WaMessage: WAMessage) {
    const message = `Purge command is missing some settings. Please check group configuration.`;
    client._wppSocket.sendMessage(groupJid, { text: message }, { quoted: WaMessage });
  }
}

