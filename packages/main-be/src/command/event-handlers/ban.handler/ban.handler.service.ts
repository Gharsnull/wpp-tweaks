import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { getMentionedJids } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';

@Injectable()
export class BanHandlerService {
  constructor() { }

  @OnEvent(Commands.BAN)
  handleBan(payload: CommandPayload) {
    const {
      groupJid,
      WaMessage,
      client,
    } = payload;

    const mentionedJids = getMentionedJids(WaMessage).filter(jid => jid !== client._userId);

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

    client._wppSocket.groupParticipantsUpdate(groupJid, getMentionedJids(WaMessage), 'remove');
  }
}
