import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getContentType, normalizeMessageContent } from '@whiskeysockets/baileys';
import { CommandService } from '../../../command/services/command/command.service';
import { GroupService } from '../../../group/services/group.service';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { 
  getContextInfo,
  getMessageText,
  isCommandMessage,
  isGroupMessage,
  isOwnMessage,
  isValidMessage,
  mimicMessage,
  parseCommand,
  removeMentionsFromText 
} from './utils/message-handler.util';

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

    messages?.forEach(async (message) => {
      const normalizedMessage = normalizeMessageContent(message.message);
      const isViewOnceMessage = message.messageStubParameters?.[0] === 'Message absent from node';
      const contentType = getContentType(normalizedMessage);

      if (!isValidMessage(normalizedMessage) && !isViewOnceMessage) {
        this._logger.log(`Invalid message received from ${message.key.participant} in group ${message.key.remoteJid}. MessageType: ${contentType}`);
        return;
      }

      // Single database query to get member data
      const member = await this._groupService.getGroupMember(
        message.key.participant,
        message.key.remoteJid,
      );

      if (member?.muted) {
        handler._wppSocket.sendMessage(message.key.remoteJid, { delete: message.key });
        return;
      }

      if (!isGroupMessage(message) || isOwnMessage(message)) {
        return;
      }

      const messageText = getMessageText(normalizedMessage, contentType);

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

      if (messageText && member?.mimic) {
        let textToMimic = messageText;
        const mentionedJids = getContextInfo(normalizedMessage, contentType)?.mentionedJid;

        if (mentionedJids?.length) {
          textToMimic = removeMentionsFromText(messageText, mentionedJids);
        }

        if(textToMimic) {
          handler._wppSocket.sendMessage(message.key.remoteJid, { text: mimicMessage(textToMimic) }, { quoted: message });
        }
      }

      this._groupService.increaseGroupMemberMessagesCount(message.key.remoteJid, message.key.participant);
    });
  }
}