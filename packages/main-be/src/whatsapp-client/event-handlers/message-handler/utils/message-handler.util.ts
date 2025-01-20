import { isJidGroup, WAMessage } from '@whiskeysockets/baileys';
import { Commands } from '../../../../command/constants/command.constants';

export const isGroupMessage = (message: WAMessage) => {
  return isJidGroup(message.key.remoteJid);
}

export const isCommandMessage = (message: WAMessage) => {
  const regex = /^\/[a-zA-Z0-9_-]+(?:\s+.+)?$/;
  const content = getMessageText(message);
  return regex.test(content);
}

export const parseCommand = (message: WAMessage): { command: Commands, args: string[] } => {
  const content = getMessageText(message);
  const args = content.split(' ');
  const command = args.shift()?.slice(1) as Commands;
  return { command, args };
}

export const getMessageText = (message: WAMessage): string => {
  return message?.message?.conversation ||
    message?.message?.extendedTextMessage?.text;
}