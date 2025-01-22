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

  @Prop()
  lastMessageAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const _schema = SchemaFactory.createForClass(GroupMember);
_schema.index({ group: 1, jid: 1 }, { unique: true });
_schema.index({ group: 1, isAdmin: 1 });
_schema.index({ group: 1, messagesCount: -1 });

export const groupMemberDefinition = {
  name: GroupMember.NAME,
  schema: _schema,
}
