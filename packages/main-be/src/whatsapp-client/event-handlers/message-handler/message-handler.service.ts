import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getContentType, normalizeMessageContent, WAMessage } from '@whiskeysockets/baileys';
import { CommandService } from '../../../command/services/command/command.service';
import { GroupService } from '../../../group/services/group.service';
import { ClientHandler } from '../../classes/client-handler';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { getMessageText, isCommandMessage, isGroupMessage, isOwnMessage, isValidMessage, parseCommand } from './utils/message-handler.util';

@Injectable()
export class MessageHandlerService {
  private readonly _logger = new Logger(MessageHandlerService.name);

  constructor(
    private readonly _groupService: GroupService,
    private readonly _commandService: CommandService,
  ) { }

  @OnEvent(WhatsappEvents.MESSAGES_UPSERT)
  async handleMessage(payload: WhatsappEventPayload<WhatsappEvents.MESSAGES_UPSERT>): Promise<void> {
    const { event, handler } = payload;
    const { messages } = event;

    messages?.forEach(message => {
      const normalizedMessage = normalizeMessageContent(message.message);
      const contentType = getContentType(normalizedMessage);

      if(!isValidMessage(normalizedMessage)) {
        this._logger.log(`Invalid message received from ${message.key.participant} in group ${message.key.remoteJid}. MessageType: ${contentType}`);
        return;
      }

      const messageText = getMessageText(normalizedMessage, contentType);

      if (!isGroupMessage(message) || isOwnMessage(message)) {
        return;
      }

      if (isCommandMessage(messageText)) {
        const { command, args } = parseCommand(messageText);
        this._commandService.handleCommand(
          command,
          {
            args,
            groupJid: message.key.remoteJid,
            senderJid: message.key.participant,
            client: handler,
            WaMessage: message,
            messageType: contentType,
            messageContent: normalizedMessage,
          }
        );
        return;
      }
      
      this._groupService.increaseGroupMemberMessagesCount(message.key.remoteJid, message.key.participant);
    });
  }

  private notifyInvalidMessage(message: WAMessage, handler: ClientHandler) {
    handler._wppSocket.sendMessage(
      message.key.remoteJid,
      { text: '@573163545096', mentions: ['573163545096@s.whatsapp.net'] },
      { quoted: message }
    )
  }
}
