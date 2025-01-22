import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { GroupService } from '../../../group/services/group.service';
import { UserPosition } from './interfaces/message-top.handler.interfaces';
import { jidToNumber } from '../../../whatsapp-client/classes/utils/client-handler.utils';

@Injectable()
export class MessageTopHandlerService {
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.MSG_TOP)
  async handleMessageTop(payload: CommandPayload) {
    const { groupJid, senderJid, client } = payload;

    const topMembers = await this.getTopMembers(groupJid, client._userId);
    const membersWithCounts: UserPosition[] = topMembers.map((member, index) => ({
      jid: member.jid,
      messagesCount: member.messagesCount,
      position: index + 1,
    }));

    let senderPosition: UserPosition;

    if (!topMembers.find((member) => member.jid === senderJid)) {
      const userRank = await this.getUserPosition(groupJid, senderJid, client._userId);
      if (userRank !== -1) {
        senderPosition = {
          jid: senderJid,
          messagesCount: userRank.messagesCount,
          position: userRank.position,
        };
      }
    }

    client._wppSocket.sendMessage(
      groupJid,
      {
        text: this.buildTopMessage(membersWithCounts, senderPosition),
        mentions: membersWithCounts.map((member) => member.jid),
      }
    );
  }

  private buildTopMessage(membersWithCounts: UserPosition[], senderPosition?: UserPosition): string {
    let message = `🏆 Top Members 🏆\n`;
    let prevPosition = -1;

    membersWithCounts.forEach((member) => {
      if (prevPosition !== member.position) {
        message += `${member.position}. `;
      }
      message += `@${jidToNumber(member.jid)} with ${member.messagesCount} messages\n`;
      prevPosition = member.position;
    });

    if (senderPosition) {
      message += `\n============================\n`;
      message += `@${jidToNumber(senderPosition.jid)} with ${senderPosition.messagesCount} messages\n`;
    }

    return message;
  }

  private getTopMembers(groupJid: string, botId: string) {
    const pipeline = [
      {
        $match: {
          groupJid,
          jid: { $ne: botId },
          active: true,
        }
      },
      { $sort: { messagesCount: -1 as const } },
      { $limit: 5 },
    ];

    return this._groupService.queryGroupMembers(pipeline);
  }

  private async getUserPosition(groupJid: string, senderJid: string, botId: string): Promise<{ position: number, messagesCount: number } | -1> {
    const senderMessageCountResult = await this._groupService.queryGroupMembers([
      {
        $match: {
          $and: [
            { groupJid },
            { jid: senderJid },
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
      return -1;
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
    };
  }
}
