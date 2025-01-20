import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandConfigurationModule } from '../command-configuration/command-configuration.module';
import { groupConfigurationDefinition } from './models/group-configuration.model';
import { GroupConfigurationService } from './services/group-configuration/group-configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([groupConfigurationDefinition]),
    CommandConfigurationModule,
  ],
  providers: [GroupConfigurationService],
  exports: [GroupConfigurationService],
})
export class GroupConfigurationModule {}
