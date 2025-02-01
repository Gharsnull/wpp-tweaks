import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupService } from '../../../group/services/group.service';
import { jidToNumber } from '../../../whatsapp-client/classes/utils/client-handler.utils';
import { getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';

@Injectable()
export class TotalMessageRankHandlerService implements CommandHandler {
   constructor(
      private readonly _groupService: GroupService,
    ) { }
  
    @OnEvent(Commands.TOTAL_MSG_RANK)
    async handle(payload: CommandPayload) {
      const { WaMessage, args, messageType, messageContent } = payload;
  
      const mentionedJids = getContextInfo(messageContent, messageType)?.mentionedJid;
  
      if(!!args?.length && !mentionedJids?.length) {
        payload.client._wppSocket.sendMessage(
          payload.groupJid,
          {
            text: 'You can only mention users or use the command with no arguments',
          },
          { quoted: WaMessage }
        );
        return;
      }
  
      if (!mentionedJids?.length) {
        this.getSenderRank(payload);
        return;
      }
  
      this.getMentionedUsersRank(payload);
      return;
    }
  
    private async getMentionedUsersRank(payload: CommandPayload) {
      const { groupJid, client, WaMessage, messageContent, messageType } = payload;
  
      const mentionedJids = getContextInfo(messageContent, messageType)?.mentionedJid;
  
      const usersRanks = await Promise.all(mentionedJids.map((jid) => this.getUserPosition(groupJid, jid, client._userId)));
  
      const message = usersRanks.map((userRank) => {
        if (userRank.position === -1) {
          return `@${jidToNumber(userRank.jid)} has to send at least one message to get a rank`;
        }
        return `@${jidToNumber(userRank.jid)} is ranked #${userRank.position} with ${userRank.totalMessagesCount} messages`;
      }).join('\n');
  
      client._wppSocket.sendMessage(
        groupJid,
        {
          text: message,
          mentions: usersRanks.map((userRank) => userRank.jid),
        },
        { quoted: WaMessage }
      );
    }
  
    private async getSenderRank(payload: CommandPayload) {
      const { groupJid, senderJid, client, WaMessage } = payload;
  
      const userRank = await this.getUserPosition(groupJid, senderJid, client._userId);
  
      if (userRank.position === -1) {
        client._wppSocket.sendMessage(
          groupJid,
          {
            text:
              `You have to send at least one message to get a rank
             Note: Commands are not counted towards the rank.`
          },
          { quoted: WaMessage }
        );
        return;
      }
  
      client._wppSocket.sendMessage(
        groupJid,
        {
          text: `Your total rank is #${userRank.position} with ${userRank.totalMessagesCount} messages`,
        },
        { quoted: WaMessage }
      );
  
    }
  
    private async getUserPosition(groupJid: string, userJid: string, botId: string): Promise<{ position: number, totalMessagesCount: number, jid: string }> {
      const senderMessageCountResult = await this._groupService.queryGroupMembers([
        {
          $match: {
            $and: [
              { groupJid },
              { jid: userJid },
              { jid: { $ne: botId } },
            ]
          }
        },
        {
          $project: {
            totalMessagesCount: 1,
          },
        },
      ]);
  
      const senderMessageCount = senderMessageCountResult[0]?.totalMessagesCount;
  
      if (senderMessageCount === undefined) {
        return {
          position: -1,
          totalMessagesCount: 0,
          jid: userJid,
        };
      }
  
      const positionResult = await this._groupService.queryGroupMembers([
        {
          $match: {
            groupJid,
            jid: { $ne: botId },
            totalMessagesCount: { $gt: senderMessageCount },
            active: true,
          },
        },
        {
          $count: 'position',
        },
      ]) as any[];
  
      const higherRankCount = positionResult[0]?.position || 0;
  
      return {
        position: higherRankCount + 1,
        totalMessagesCount: senderMessageCount,
        jid: userJid,
      };
    }
}
