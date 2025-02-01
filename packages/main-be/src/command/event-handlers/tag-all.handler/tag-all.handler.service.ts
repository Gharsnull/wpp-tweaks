import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';
import { buildQuotedMessage, getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';
import { GroupService } from '../../../group/services/group.service';
import { ClientHandler } from '../../../whatsapp-client/classes/client-handler';
import { WAMessage } from '@whiskeysockets/baileys';

@Injectable()
export class TagAllHandlerService implements CommandHandler {
  private readonly _logger = new Logger(TagAllHandlerService.name);
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.TAG_ALL)
  async handle(payload: CommandPayload): Promise<void> {
    const {
      groupJid,
      messageContent,
      messageType,
      client,
      WaMessage,
    } = payload;

    const contextInfo = getContextInfo(messageContent, messageType);

    if (!contextInfo) {
      this.notifyErrorGettingMessageData(client, groupJid, WaMessage);
      return;
    }

    if(!contextInfo.quotedMessage) {
      this.notifyQuotedMessageMissing(client, groupJid, WaMessage);
      return
    }

    try {
      const groupMembers = await this._groupService.queryGroupMembers([{ $match: { groupJid, active: true } }]);
      const mentionedJids = groupMembers.map(member => member.jid);
      await client._wppSocket.sendMessage(groupJid, { text: '👆👆👆', contextInfo: { mentionedJid: mentionedJids} }, { quoted: buildQuotedMessage(contextInfo, groupJid) });
    } catch (error) {
      this._logger.error(`Error sending message to group ${groupJid} with error: ${error}`);
      this.notifyErrorGettingMessageData(client, groupJid, WaMessage); 
    }

  }

  notifyErrorGettingMessageData(client: ClientHandler, groupJid: string, message: WAMessage) {
    client._wppSocket.sendMessage(groupJid, { text: `ERROR: Couldn't get message data` }, { quoted: message });
  }

  notifyQuotedMessageMissing(client: ClientHandler, groupJid: string, message: WAMessage) {
    client._wppSocket.sendMessage(groupJid, { text: `ERROR: Quoted message missing` }, { quoted: message });
  }
}
