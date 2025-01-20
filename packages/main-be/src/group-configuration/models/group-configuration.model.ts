import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Group } from '../../group/models/group.model';

export interface GroupCommandOverride {
  name: string;
  enabled: boolean;
  adminOnly: boolean;
  whiteList: string[];
}

@Schema({ timestamps: true })
export class GroupConfiguration {
  public static readonly NAME = 'group-configuration';

  @Prop()
  id: string;

  @Prop({ type: String, ref: Group.NAME })
  groupJid: string;

  @Prop()
  commands: GroupCommandOverride[];
}

const _schema = SchemaFactory.createForClass(GroupConfiguration);
_schema.index({ group: 1 }, { unique: true })

export const groupConfigurationDefinition = {
  name: GroupConfiguration.NAME,
  schema: _schema,
}