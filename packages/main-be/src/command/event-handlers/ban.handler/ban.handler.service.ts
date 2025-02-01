import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';
import { getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';

@Injectable()
export class BanHandlerService implements CommandHandler {
  constructor() { }

  @OnEvent(Commands.BAN)
  handle(payload: CommandPayload) {
    const {
      groupJid,
      WaMessage,
      client,
      messageType,
      messageContent,
    } = payload;

    const mentionedJids = getContextInfo(messageContent, messageType).mentionedJid.filter(jid => jid !== client._userId);

    if (!mentionedJids?.length) {
      client._wppSocket.sendMessage(
        groupJid,
        { text: 'Please mention the users you want to ban after the command.' },
        { quoted: WaMessage }
      );
      return;
    }


    client._wppSocket.sendMessage(
      groupJid,
      { text: 'Banned!' },
      { quoted: WaMessage }
    );

    client._wppSocket.groupParticipantsUpdate(groupJid, mentionedJids, 'remove');
  }
}
