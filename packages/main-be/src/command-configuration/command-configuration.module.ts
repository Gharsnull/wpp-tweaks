import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { commandConfigurationDefinition } from './models/command-configuration.model';
import { CommandConfigurationService } from './services/command-configuration/command-configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([commandConfigurationDefinition]),
  ],
  providers: [CommandConfigurationService],
  exports: [CommandConfigurationService],
})
export class CommandConfigurationModule {}
