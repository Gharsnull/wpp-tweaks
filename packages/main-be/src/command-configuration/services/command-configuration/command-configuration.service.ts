import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommandConfiguration } from '../../models/command-configuration.model';
import { CommandConfigurations } from '../../constants/command-configuration.constants';

@Injectable()
export class CommandConfigurationService {
  constructor(
    @InjectModel(CommandConfiguration.NAME) private readonly _commandConfigurationModel: Model<CommandConfiguration>,
  ) {
    Promise.all(CommandConfigurations.map(commandConfiguration => this.upsertCommandConfiguration(commandConfiguration as CommandConfiguration)));
  }

  getCommandConfigurations(): Promise<CommandConfiguration[]> {
    return this._commandConfigurationModel.find().exec();
  }

  upsertCommandConfiguration(commandConfiguration: CommandConfiguration): Promise<CommandConfiguration> {
    return this._commandConfigurationModel.findOneAndUpdate({ name: commandConfiguration.name }, commandConfiguration, { upsert: true, new: true }).exec();
  }
}
