import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from '../models/group.model';
import { DeleteResult, Model } from 'mongoose';
import { GroupMember } from '../models/group-member.model';
import { BulkWriteResult } from 'mongodb';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.NAME) private readonly _groupModel: Model<Group>,
    @InjectModel(GroupMember.NAME) private readonly _groupMemberModel: Model<GroupMember>,
  ) {}

  upsertGroup(group: Group): Promise<Group> {
    return this._groupModel.findOneAndUpdate({ jid: group.jid }, group, { upsert: true, new: true }).exec();
  }

  getGroupByJid(jid: string): Promise<Group> {
    return this._groupModel.findOne({ jid }).exec();
  }

  deleteGroup(jid: string): Promise<Group> {
    return this._groupModel.findOneAndDelete({ jid }).exec();
  }

  updateGroup(jid: string, group: Group): Promise<Group> {
    return this._groupModel.findOneAndUpdate({ jid }, group, { new: true }).exec();
  }

  getGroups(): Promise<Group[]> {
    return this._groupModel.find().exec();
  }
  
  getGroupMembers(jid: string, onlyAdmins?: boolean): Promise<GroupMember[]> {
    const query = { jid };

    if (onlyAdmins) {
      query['isAdmin'] = true;
    }

    return this._groupMemberModel.find(query).exec();
  }

  upsertGroupMembers(members: GroupMember[]): Promise<BulkWriteResult> {
    return this._groupMemberModel.bulkWrite(members.map(member => ({
      updateOne: {
        filter: { jid: member.jid, groupJid: member.groupJid },
        update: { $set: member },
        upsert: true,
      },
    })));
  }

  increaseGroupMemberMessagesCount(groupJid: string, jid: string): Promise<GroupMember> {
    return this._groupMemberModel.findOneAndUpdate({ groupJid, jid }, { $inc: { messagesCount: 1 } }, { new: true }).exec();
  }
  removeGroupMembers(groupJid: string, participants: string[]): Promise<DeleteResult> {
    return this._groupMemberModel.deleteMany({ groupJid, jid: { $in: participants } }).exec();
  }

  updateGroupMember(jid: string, member: GroupMember): Promise<GroupMember> {
    return this._groupMemberModel.findOneAndUpdate({ jid }, member, { new: true }).exec();
  }

  getGroupMember(jid: string, groupJid: string): Promise<GroupMember> {
    return this._groupMemberModel.findOne({ jid, groupJid }).exec();
  }
}
