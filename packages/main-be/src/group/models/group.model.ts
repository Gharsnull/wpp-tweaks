import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Group {
  public static readonly NAME = 'group';

  @Prop()
  id: string;

  @Prop()
  jid: string;

  @Prop()
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const _schema = SchemaFactory.createForClass(Group);
_schema.index({ jid: 1 }, { unique: true });

export const groupDefinition = {
  name: Group.NAME,
  schema: _schema,
}