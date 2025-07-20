import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupService } from '../../../group/services/group.service';
import { Commands } from '../../constants/command.constants';
import { CommandHandler, CommandPayload } from '../../interfaces/command.interfaces';

@Injectable()
export class BanAllHandlerService implements CommandHandler {
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(Commands.BAN_ALL)
  async handle(payload: CommandPayload) {
    const {
      groupJid,
      WaMessage,
      client,
    } = payload;

    const groupMembers = await this._groupService.getNonAdminMembers(groupJid);
    const groupJids = groupMembers.map(member => member.jid);

    await client._wppSocket.sendMessage(
      groupJid,
      { text: 'Banning all members...' },
      { quoted: WaMessage }
    );

    await client._wppSocket.groupParticipantsUpdate(groupJid, groupJids, 'remove');
  }
}
