import { getContentType, isJidGroup, WAMessage, WAMessageContent } from '@whiskeysockets/baileys';
import { Commands } from '../../../../command/constants/command.constants';
import { ContentTypeTextPaths, ContenTypeMentionedJidPaths, ValidMessageTypes } from '../constants/message-handler.constants';
import { get } from 'lodash';

export const isGroupMessage = (message: WAMessage) => {
  return isJidGroup(message.key.remoteJid);
}

export const isOwnMessage = (message: WAMessage) => {
  return message.key.fromMe;
}

export const isValidMessage = (content: WAMessageContent) => {
  return !!ValidMessageTypes[getContentType(content)];
}

export const getMessageText = (content: WAMessageContent, contentType: keyof WAMessageContent): string => {
  return get(content, ContentTypeTextPaths[contentType]);
}

export const getMentionedJids = (content: WAMessageContent, contentType: keyof WAMessageContent): string[] => {
  return get(content, ContenTypeMentionedJidPaths[contentType]);
}

export const isCommandMessage = (text: string) => {
  const regex = /^\/[a-zA-Z0-9_-]+(?:\s+.+)?$/;
  return regex.test(text);
}

export const parseCommand = (text: string): { command: Commands, args: string[] } => {
  const args = text.split(' ');
  const command = args.shift()?.slice(1) as Commands;
  return { command, args };
}