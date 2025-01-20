import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupCommandOverride, GroupConfiguration } from '../../models/group-configuration.model';
import { Model, PipelineStage } from 'mongoose';
import { CommandConfigurationService } from '../../../command-configuration/services/command-configuration/command-configuration.service';

@Injectable()
export class GroupConfigurationService {
  constructor(
    @InjectModel(GroupConfiguration.NAME) private readonly _groupConfigurationModel: Model<GroupConfiguration>,
    private readonly _commandConfigurationService: CommandConfigurationService,
  ) {}

  async upsertGroupConfiguration(groupJid: string): Promise<GroupConfiguration> {
    const commandConfigurations = await this._commandConfigurationService.getCommandConfigurations();
    const commands: GroupCommandOverride[] = commandConfigurations.map(command => ({
      name: command.name,
      enabled: command.enabled,
      adminOnly: command.adminOnly,
      whiteList: [],
    }))

    return this._groupConfigurationModel.findOneAndUpdate({ groupJid }, { commands }, { upsert: true, new: true });
  }

  queryGroupConfiguration(pipeline: PipelineStage[]): Promise<GroupConfiguration[]> {
    return this._groupConfigurationModel.aggregate(pipeline).exec();
  }
}
