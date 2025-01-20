import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { groupDefinition } from './models/group.model';
import { groupMemberDefinition } from './models/group-member.model';
import { GroupService } from './services/group.service';

@Module({
  imports: [
    MongooseModule.forFeature([groupDefinition, groupMemberDefinition]),
  ],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
