import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class CommandConfiguration {
  public static readonly NAME = 'command-configuration';

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  adminOnly: boolean;

  @Prop()
  enabled: boolean;

  @Prop({ type: Object, of: SchemaTypes.Mixed, required: false})
  settings?: Record<string, unknown>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const _schema = SchemaFactory.createForClass(CommandConfiguration);
_schema.index({ name: 1 }, { unique: true });

export const commandConfigurationDefinition = {
  name: CommandConfiguration.NAME,
  schema: _schema,
}