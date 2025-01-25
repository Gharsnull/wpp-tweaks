import { CommandConfiguration } from '../models/command-configuration.model';

export const CommandConfigurations: Partial<CommandConfiguration>[] = [
  {
    name: 'ping',
    description: 'Ping the bot',
    adminOnly: false,
    enabled: true
  },
  {
    name: 'ban',
    description: 'Ban tagged users',
    adminOnly: true,
    enabled: true
  },
  {
    name: 'msgTop',
    adminOnly: false,
    enabled: true,
    description: 'Show top 5 participants based on message count'
  },
  {
    name: 'msgRank',
    adminOnly: false,
    enabled: true,
    description: 'Show rank of the sender or the tagged participants'
  },
  {
    name: 'mute',
    adminOnly: true,
    enabled: true,
    description: 'Mute tagged users'
  },
  {
    name: 'unmute',
    adminOnly: true,
    enabled: true,
    description: 'Unmute tagged users'
  },
  {
    name: 'help',
    adminOnly: false,
    enabled: true,
    description: 'Get list of commands'
  }
]