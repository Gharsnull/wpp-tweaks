import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupService } from '../../../group/services/group.service';
import { jidToNumber } from '../../../whatsapp-client/classes/utils/client-handler.utils';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';
import { TotalUserPosition } from './interfaces/total-message-top.interfaces';

@Injectable()
export class TotalMessageTopHandlerService {
    constructor(
      private readonly _groupService: GroupService,
    ) { }
  
    @OnEvent(Commands.TOTAL_MSG_TOP)
    async handle(payload: CommandPayload) {
      const { groupJid, client } = payload;
  
      const topMembers = await this.getTopMembers(groupJid, client._userId);
      const membersWithCounts: TotalUserPosition[] = topMembers.map((member, index) => ({
        jid: member.jid,
        totalMessagesCount: member.totalMessagesCount,
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
  
    private buildTopMessage(membersWithCounts: TotalUserPosition[]): string {
      let message = `🏆 Top All Time Members 🏆\n`;
      let prevPosition = -1;
  
      membersWithCounts.forEach((member) => {
        if (prevPosition !== member.position) {
          message += `${member.position}. `;
        }
        message += `@${jidToNumber(member.jid)} with ${member.totalMessagesCount} messages\n`;
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
        { $sort: { totalMessagesCount: -1 as const } },
        { $limit: 5 },
      ];
  
      return this._groupService.queryGroupMembers(pipeline);
    }
}
