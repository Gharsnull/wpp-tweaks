import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupService } from '../../../group/services/group.service';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';
import { jidToNumber } from '../../../whatsapp-client/classes/utils/client-handler.utils';
import { getContextInfo } from '../../../whatsapp-client/event-handlers/message-handler/utils/message-handler.util';

@Injectable()
export class MessageRankHandlerService implements CommandHandler {

  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.MSG_RANK)
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
      return `@${jidToNumber(userRank.jid)} is ranked #${userRank.position} with ${userRank.messagesCount} messages`;
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
        text: `You are ranked #${userRank.position} with ${userRank.messagesCount} messages`,
      },
      { quoted: WaMessage }
    );

  }

  private async getUserPosition(groupJid: string, userJid: string, botId: string): Promise<{ position: number, messagesCount: number, jid: string }> {
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
          messagesCount: 1,
        },
      },
    ]);

    const senderMessageCount = senderMessageCountResult[0]?.messagesCount;

    if (senderMessageCount === undefined) {
      return {
        position: -1,
        messagesCount: 0,
        jid: userJid,
      };
    }

    const positionResult = await this._groupService.queryGroupMembers([
      {
        $match: {
          groupJid,
          jid: { $ne: botId },
          messagesCount: { $gt: senderMessageCount },
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
      messagesCount: senderMessageCount,
      jid: userJid,
    };
  }
}
