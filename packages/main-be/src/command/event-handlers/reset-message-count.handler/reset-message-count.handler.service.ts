import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FilterQuery, PipelineStage } from 'mongoose';
import { GroupMember } from '../../../group/models/group-member.model';
import { GroupService } from '../../../group/services/group.service';
import { getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';

@Injectable()
export class ResetMessageCountHandlerService implements CommandHandler {
  constructor(
    private readonly _groupService: GroupService,
  ) { }
  
  @OnEvent(Commands.RESET_MSG_COUNT)
  async handle(payload: CommandPayload) {
    const { WaMessage, messageType, messageContent, client, groupJid } = payload;

    const mentionedJids = getContextInfo(messageContent, messageType)?.mentionedJid?.filter(jid => jid !== client._userId);
    
    if(!mentionedJids?.length) {
      payload.client._wppSocket.sendMessage(
        payload.groupJid,
        {
          text: 'Mention the users whose message count you want to reset',
        },
        { quoted: WaMessage }
      );
      return;
    }

    await this.resetMessageCount(payload.groupJid, mentionedJids);

    const message = 'Message count has been reset for mentioned users';

    await client._wppSocket.sendMessage(
      groupJid,
      { text: message },
      { quoted: WaMessage }
    );
  }

  @OnEvent(Commands.RESET_ALL_MSG_COUNT)
  async handleResetAllMessageCount(payload: CommandPayload) {
    const { WaMessage, client, groupJid } = payload;

    await this.resetMessageCount(groupJid);

    const message = 'All users message count has been reset';

    await client._wppSocket.sendMessage(
      groupJid,
      { text: message },
      { quoted: WaMessage }
    );
  }

  private resetMessageCount(
    groupJid: string, 
    mentionedJids?: string[]
  ) {
    const matchCondition: FilterQuery<GroupMember> = { groupJid };
    if (mentionedJids && mentionedJids.length > 0) {
      matchCondition.jid = { $in: mentionedJids };
    }
  
    const pipeline: PipelineStage[] = [
      {
        $set: {
          messagesCount: 0,
        },
      },
    ];
  
    return this._groupService.updateGroupMembers(matchCondition, pipeline);
  }
}
