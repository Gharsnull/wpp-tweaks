import { Injectable } from '@nestjs/common';
import { GroupService } from '../../../group/services/group.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';

@Injectable()
export class MessageRankHandlerService {

  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.MSG_RANK)
  async handleMessageRank(payload: CommandPayload) {
    const { groupJid, senderJid, client, WaMessage } = payload;

    const userRank = await this.getUserPosition(groupJid, senderJid, client._userId);

    if (userRank === -1) {
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
