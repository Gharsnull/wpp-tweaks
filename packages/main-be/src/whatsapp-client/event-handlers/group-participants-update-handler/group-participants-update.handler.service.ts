import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupMember } from '../../../group/models/group-member.model';
import { GroupService } from '../../../group/services/group.service';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { GroupParticipantsUpdateActions } from './constants/group-participants-update-handler.constants';

@Injectable()
export class GroupParticipantsUpdateHandlerService {
  private readonly _logger = new Logger(GroupParticipantsUpdateHandlerService.name);
  constructor(
    private readonly _groupService: GroupService,
  ) { }

  @OnEvent(WhatsappEvents.GROUP_PARTICIPANTS_UPDATE)
  handleGroupParticipantsUpdate(payload: WhatsappEventPayload<WhatsappEvents.GROUP_PARTICIPANTS_UPDATE>) {
    const {
      event,
    } = payload;

    const { participants, action, id: groupJid } = event;

    if(action === GroupParticipantsUpdateActions.DEMOTE || action === GroupParticipantsUpdateActions.PROMOTE) {
      const isAdmin = action === GroupParticipantsUpdateActions.PROMOTE;
      const update = participants.map(participant => ({
        jid: participant,
        groupJid,
        isAdmin,
      })) as GroupMember[];
      
      update.forEach(member => {
        this._logger.log(`Updating ${member.jid} admin status to ${member.isAdmin} in group ${member.groupJid}`);
      });
      this._groupService.upsertGroupMembers(update);
      return;
    }

    if(action === GroupParticipantsUpdateActions.REMOVE) {
      participants.forEach(participant => {
        this._logger.log(`Removing ${participant} from group ${groupJid}`);
      });
      this._groupService.removeGroupMembers(groupJid, participants);
      return;
    }

    if(action === GroupParticipantsUpdateActions.ADD) {
      participants.forEach(participant => {
        this._logger.log(`Adding ${participant} to group ${groupJid}`);
      });
      const update = participants.map(participant => ({
        jid: participant,
        groupJid,
        isAdmin: false,
      })) as GroupMember[];
      this._groupService.upsertGroupMembers(update);
      return;
    }
    
  }
}
