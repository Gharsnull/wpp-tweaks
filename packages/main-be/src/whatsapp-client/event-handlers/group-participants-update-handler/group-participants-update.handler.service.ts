import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { GroupConfiguration } from '../../../group-configuration/models/group-configuration.model';
import { GroupConfigurationService } from '../../../group-configuration/services/group-configuration/group-configuration.service';
import { GroupMember } from '../../../group/models/group-member.model';
import { GroupService } from '../../../group/services/group.service';
import { jidToNumber } from '../../classes/utils/client-handler.utils';
import { WhatsappEvents } from '../../constants/whatsapp-client.constants';
import { WhatsappEventPayload } from '../../interfaces/whatsapp-client.interfaces';
import { GroupParticipantsUpdateActions } from './constants/group-participants-update-handler.constants';

@Injectable()
export class GroupParticipantsUpdateHandlerService {
  private readonly _logger = new Logger(GroupParticipantsUpdateHandlerService.name);
  constructor(
    private readonly _groupService: GroupService,
    private readonly _groupConfigService: GroupConfigurationService,
  ) { }

  @OnEvent(WhatsappEvents.GROUP_PARTICIPANTS_UPDATE)
  async handleGroupParticipantsUpdate(payload: WhatsappEventPayload<WhatsappEvents.GROUP_PARTICIPANTS_UPDATE>) {
    const {
      event,
      handler,
    } = payload;

    const { participants, action, id: groupJid } = event;

    if (action === GroupParticipantsUpdateActions.DEMOTE || action === GroupParticipantsUpdateActions.PROMOTE) {
      const isAdmin = action === GroupParticipantsUpdateActions.PROMOTE;
      const update = participants.map(participant => ({
        jid: participant,
        groupJid,
        isAdmin,
      })) as GroupMember[];

      update.forEach(member => {
        this._logger.log(`Updating ${member.jid} admin status to ${member.isAdmin} in group ${member.groupJid}`);
      });
      await this._groupService.upsertGroupMembers(update);
      return;
    }

    if (action === GroupParticipantsUpdateActions.REMOVE) {
      participants.forEach(participant => {
        this._logger.log(`Removing ${participant} from group ${groupJid}`);
      });

      const update = participants.map(participant => ({
        jid: participant,
        groupJid,
        active: false,
      })) as GroupMember[];
      await this._groupService.upsertGroupMembers(update);
      return;
    }

    if (action === GroupParticipantsUpdateActions.ADD) {
      const groupConfig = await this._groupConfigService.queryGroupConfiguration([{ $match: { groupJid } }]);
      const botMember = await this._groupService.queryGroupMembers([{ $match: { groupJid, jid: handler._userId } }]);
      const isBotAdmin = botMember?.[0]?.isAdmin;

      if (!groupConfig?.length) {
        this._logger.error(`Group configuration not found for group ${groupJid}`);
        return;
      }

      const { membersToAdd, membersToRemove, invalidNumbers } = this.validateNewMembers(participants, groupConfig[0]);

      if (invalidNumbers?.length) {
        this._logger.error(`Invalid phone numbers: ${invalidNumbers.join(', ')}`);
        membersToAdd.push(...invalidNumbers);

        let text = 'Couldn\'t check phone numbers: ';
        const numbers = invalidNumbers.map(number => jidToNumber(number));
        text += numbers.map(number => `@${number}`).join(', ');
        handler._wppSocket.sendMessage(groupJid, { text, mentions: numbers });
      }

      if (membersToAdd?.length) {
        const update = membersToAdd.map(member => ({
          jid: member,
          groupJid,
          isAdmin: false,
          active: true,
        })) as GroupMember[];
        this._logger.log(`Adding ${membersToAdd.join(', ')} members to group ${groupJid}`);
        await this._groupService.upsertGroupMembers(update);
      }

      if (membersToRemove?.length) {
        if (!isBotAdmin) {
          this._logger.error(`Bot is not an admin in group ${groupJid}`);
          const numbers = membersToRemove.map(number => jidToNumber(number));
          handler._wppSocket.sendMessage(
            groupJid,
            {
              text: 'Detected non-whitelisted numbers but I can\'t remove them because I\'m not an admin in this group. \n Invalid numbers:\n' + numbers.map(n => `@${n}`).join(',\n'),
              mentions: numbers,
            });
          return;
        }
        this._logger.log(`Banning ${membersToRemove.join(', ')} members from group ${groupJid}`);
        handler._wppSocket.groupParticipantsUpdate(groupJid, membersToRemove, 'remove');
      }
      return;
    }

  }

  private validateNewMembers(participants: string[], groupConfig: GroupConfiguration): { membersToAdd: string[], membersToRemove: string[], invalidNumbers: string[] } {
    const membersToAdd = [];
    const membersToRemove = [];
    const invalidNumbers = [];

    if (!groupConfig.countryWhitelist?.length) {
      this._logger.error(`Country whitelist not found for group ${groupConfig.groupJid}`);
      return { membersToAdd: participants, membersToRemove, invalidNumbers };
    }

    participants.forEach(participant => {
      const number = `+${jidToNumber(participant)}`;
      const parsedPhone = parsePhoneNumberFromString(number);

      if (!parsedPhone) {
        this._logger.error(`Failed to parse phone number for ${participant}`);
        invalidNumbers.push(participant);
        return;
      }

      const country = parsedPhone.country;
      const isCountryWhitelisted = groupConfig.countryWhitelist.includes(country);

      if (!isCountryWhitelisted) {
        membersToRemove.push(participant);
        return;
      }
      membersToAdd.push(participant);
    });

    return { membersToAdd, membersToRemove, invalidNumbers };
  }
}
