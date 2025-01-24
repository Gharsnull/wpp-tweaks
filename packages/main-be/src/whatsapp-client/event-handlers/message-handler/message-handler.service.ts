import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { isCommandMessage, isGroupMessage, isOwnMessage, isUserMessage, parseCommand } from './utils/message-handler.util';
import { GroupService } from '../../../group/services/group.service';
import { CommandService } from '../../../command/services/command/command.service';

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
      if (!isGroupMessage(message) || isOwnMessage(message) || !isUserMessage(message)) {
        return;
      }

      if (isCommandMessage(message)) {
        const { command, args } = parseCommand(message);
        this._commandService.handleCommand(
          command,
          {
            args,
            groupJid: message.key.remoteJid,
            senderJid: message.key.participant,
            client: handler,
            WaMessage: message,
          }
        );
        return;
      }

      this._logger.log(`Received message from ${message.key.participant} in group ${message.key.remoteJid}`);
      this._logger.log(JSON.stringify(message, null, 2));
      this._groupService.increaseGroupMemberMessagesCount(message.key.remoteJid, message.key.participant);
    });
  }
}
