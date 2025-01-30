import { Injectable } from '@nestjs/common';
import { GroupService } from '../../../group/services/group.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { GroupMember } from '../../../group/models/group-member.model';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';

@Injectable()
export class MimicHandlerService {
  constructor(
    private readonly _groupService: GroupService
  ) { }

  @OnEvent(Commands.MIMIC)
  handleMimic(payload: CommandPayload) {
    this.handleMimicUnmimic(payload, true);
  }

  @OnEvent(Commands.UNMIMIC)
  handleUnmimic(payload: CommandPayload) {
    this.handleMimicUnmimic(payload, false);
  }

  private async handleMimicUnmimic(payload: CommandPayload, mimic: boolean) {
    const {
      groupJid,
      client,
      messageType,
      messageContent,
      WaMessage,
    } = payload;

    const mentionedJids = getContextInfo(messageContent, messageType).mentionedJid.filter(jid => jid !== client._userId);

    if (!mentionedJids?.length) {
      client._wppSocket.sendMessage(
        groupJid,
        { text: `Please mention the users you want to ${mimic ? 'mimic' : 'unmimic'} after the command.` }
      );
      return;
    }

    await this.updateUserMimicStatus(groupJid, mentionedJids, mimic);

    await client._wppSocket.sendMessage(
      groupJid,
      { text: mimic ? 'Mimic enabled!' : 'Mimic disabled!' },
      { quoted: WaMessage }
    );
  }

  private updateUserMimicStatus(groupJid: string, mentionedJids: string[], mimic: boolean) {
    const members = mentionedJids.map(jid => ({
      jid,
      groupJid,
      mimic: mimic,
      isAdmin: false,
    }));

    return this._groupService.upsertGroupMembers(members as GroupMember[]);
  }
}
