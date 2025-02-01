import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { GroupService } from '../../../group/services/group.service';
import { Group } from '../../../group/models/group.model';
import { GroupMember } from '../../../group/models/group-member.model';
import { GroupConfigurationService } from '../../../group-configuration/services/group-configuration/group-configuration.service';

@Injectable()
export class GroupHandlerService {
  private readonly _logger = new Logger(GroupHandlerService.name);

  constructor(
    private readonly _groupService: GroupService,
    private readonly _groupConfigurationService: GroupConfigurationService,
  ) { }

  @OnEvent(WhatsappEvents.GROUPS_UPSERT)
  async handleGroupUpsert(payload: WhatsappEventPayload<WhatsappEvents.GROUPS_UPSERT>): Promise<void> {
    const { event: groups } = payload;

  groups?.forEach(async group => {
      this._logger.log(`Upserting group ${group.subject}:${group.id}`);
      const groupPayoad: Partial<Group> = {
        jid: group.id,
        name: group.subject,
      };

      const savedGroup = await this._groupService.upsertGroup(groupPayoad as Group);
      const membersToSave = group.participants.map(member => ({
        jid: member.id,
        groupJid: savedGroup.jid,
        isAdmin: !!member.admin,
      }));

      await Promise.all([
        this._groupService.upsertGroupMembers(membersToSave as GroupMember[]),
        this._groupConfigurationService.upsertGroupConfiguration(group.id),
      ])
    })

  }
}
