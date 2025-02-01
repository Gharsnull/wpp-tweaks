import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupService } from '../../../group/services/group.service';
import { jidToNumber } from '../../../whatsapp-client/classes/utils/client-handler.utils';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';
import { UserPosition } from './interfaces/message-top.handler.interfaces';

@Injectable()
export class MessageTopHandlerService implements CommandHandler {
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.MSG_TOP)
  async handle(payload: CommandPayload) {
    const { groupJid, client } = payload;

    const topMembers = await this.getTopMembers(groupJid, client._userId);
    const membersWithCounts: UserPosition[] = topMembers.map((member, index) => ({
      jid: member.jid,
      messagesCount: member.messagesCount,
      position: index + 1,
    }));

    client._wppSocket.sendMessage(
      groupJid,
      {
        text: this.buildTopMessage(membersWithCounts),
        mentions: membersWithCounts.map((member) => member.jid),
      }
    );
  }

  private buildTopMessage(membersWithCounts: UserPosition[]): string {
    let message = `🏆 Top Members 🏆\n`;
    let prevPosition = -1;

    membersWithCounts.forEach((member) => {
      if (prevPosition !== member.position) {
        message += `${member.position}. `;
      }
      message += `@${jidToNumber(member.jid)} with ${member.messagesCount} messages\n`;
      prevPosition = member.position;
    });
    
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
}
