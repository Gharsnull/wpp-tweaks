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
    adminOnly: true,
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
  },
  {
    name: 'mimic',
    adminOnly: true,
    enabled: true,
    description: 'Mimic tagged users'
  },
  {
    name: 'unmimic',
    adminOnly: true,
    enabled: true,
    description: 'Unmimic tagged users'
  },
  {
    name: 'tagAll',
    adminOnly: true,
    enabled: true,
    description: 'Tag all group members'
  },
  {
    name: 'purge',
    adminOnly: true,
    enabled: true,
    description: 'Ban last month inactive group members, check command settings for further configuration',
    settings: null,
  },
  {
    name: 'totalMsgRank',
    adminOnly: false,
    enabled: true,
    description: 'Show rank of the sender or the tagged participants based on total message count'
  },
  {
    name: 'totalMsgTop',
    adminOnly: true,
    enabled: true,
    description: 'Show top 5 participants based on total message count'
  }
]