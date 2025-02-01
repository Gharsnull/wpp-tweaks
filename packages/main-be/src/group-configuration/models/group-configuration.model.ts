import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Group } from '../../group/models/group.model';
import { CountryCode } from 'libphonenumber-js';

export interface GroupCommandOverride<T = Record<string, unknown>> {
  name: string;
  enabled: boolean;
  adminOnly: boolean;
  whiteList: string[];
  settings?: T;
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

  @Prop()
  countryWhitelist: CountryCode[];
}

const _schema = SchemaFactory.createForClass(GroupConfiguration);
_schema.index({ groupJid: 1 }, { unique: true })

export const groupConfigurationDefinition = {
  name: GroupConfiguration.NAME,
  schema: _schema,
}