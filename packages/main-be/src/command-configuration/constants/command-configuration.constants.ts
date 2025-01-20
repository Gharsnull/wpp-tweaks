import { CommandConfiguration } from '../models/command-configuration.model';

export const CommandConfigurations: Partial<CommandConfiguration>[] = [
  {
    name: 'ping',
    description: 'Ping the bot',
    adminOnly: false,
    enabled: true
  }
]