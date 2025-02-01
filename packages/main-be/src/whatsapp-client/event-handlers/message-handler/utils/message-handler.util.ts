import { getContentType, isJidGroup, normalizeMessageContent, WAContextInfo, WAMessage, WAMessageContent } from '@whiskeysockets/baileys';
import { get } from 'lodash';
import { Commands } from '../../../../command/constants/command.constants';
import { jidToNumber } from '../../../classes/utils/client-handler.utils';
import { ContentTypeTextPaths, ContextInfoPaths, ValidMessageTypes } from '../constants/message-handler.constants';

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

export const getContextInfo = (content: WAMessageContent, contentType: keyof WAMessageContent): WAContextInfo => {
  return get(content, ContextInfoPaths[contentType]);
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

export const mimicMessage = (text: string): string => {
  return text.replace(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g, match => {
    const isUpperCase = match === match.toUpperCase();
    const hasAccent = /[áéíóúÁÉÍÓÚ]/.test(match);
    
    return hasAccent ? (isUpperCase ? 'Í' : 'í') : (isUpperCase ? 'I' : 'i');
  });
}

export const removeMentionsFromText = (text: string, mentionedJids: string[]): string => {
  const mentionedNumbers = mentionedJids.map(jidToNumber);
  return mentionedNumbers.reduce((acc, jid) => acc.replace(new RegExp(`@${jid}`, 'g'), ''), text);
}

export const buildQuotedMessage = (contextInfo: WAContextInfo, groupJid: string): WAMessage => {
  const message = normalizeMessageContent(contextInfo.quotedMessage);
  return {
    key: {
      remoteJid: groupJid,
      id: contextInfo.stanzaId,
      participant: contextInfo.participant,
    },
    message,
  }
}