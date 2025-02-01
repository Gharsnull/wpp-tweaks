import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Group } from './group.model';

@Schema({ timestamps: true })
export class GroupMember {
  public static readonly NAME = 'group-member';

  @Prop()
  id: string;

  @Prop()
  jid: string;

  @Prop({ type: String, ref: Group.NAME })
  groupJid: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  messagesCount: number;

  @Prop({ default: 0 })
  totalMessagesCount: number;

  @Prop({ default: false })
  muted: boolean;

  @Prop({ default: false })
  mimic: boolean;

  @Prop()
  lastMessageAt: Date;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const _schema = SchemaFactory.createForClass(GroupMember);
_schema.index({ groupJid: 1, jid: 1 }, { unique: true });
_schema.index({ groupJid: 1, isAdmin: 1 });
_schema.index({ groupJid: 1, messagesCount: -1 });
_schema.index({ groupJid: 1, totalMessagesCount: -1 });
_schema.index({ groupJid: 1, muted: 1 });
_schema.index({ groupJid: 1, mimic: 1 });

export const groupMemberDefinition = {
  name: GroupMember.NAME,
  schema: _schema,
}
