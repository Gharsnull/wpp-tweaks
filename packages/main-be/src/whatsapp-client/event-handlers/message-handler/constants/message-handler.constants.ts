export enum ValidMessageTypes {
  conversation = "conversation",
  extendedTextMessage = "extendedTextMessage",
  imageMessage = "imageMessage",
  videoMessage = "videoMessage",
  stickerMessage = "stickerMessage",
  audioMessage = "audioMessage",
  documentMessage = "documentMessage",
  pollCreationMessageV3 = "pollCreationMessageV3",
  contactMessage = "contactMessage",
  eventMessage = "eventMessage",
  ptvMessage = "ptvMessage",
}

export const ContentTypeTextPaths = {
  [ValidMessageTypes.conversation]: 'conversation',
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.text',
  [ValidMessageTypes.imageMessage]: 'imageMessage.caption',
  [ValidMessageTypes.videoMessage]: 'videoMessage.caption',
  [ValidMessageTypes.documentMessage]: 'documentMessage.caption',
  [ValidMessageTypes.pollCreationMessageV3]: 'pollCreationMessageV3.name',
  [ValidMessageTypes.eventMessage]: 'eventMessage.name',
} as const

export const ContenTypeMentionedJidPaths = {
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.contextInfo.mentionedJid',
  [ValidMessageTypes.imageMessage]: 'imageMessage.contextInfo.mentionedJid',
  [ValidMessageTypes.videoMessage]: 'videoMessage.contextInfo.mentionedJid',
  [ValidMessageTypes.documentMessage]: 'documentMessage.contextInfo.mentionedJid',
} as const

export const QuotedMessagePaths = {
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.contextInfo.quotedMessage',
  [ValidMessageTypes.imageMessage]: 'imageMessage.contextInfo.quotedMessage',
  [ValidMessageTypes.videoMessage]: 'videoMessage.contextInfo.quotedMessage',
  [ValidMessageTypes.documentMessage]: 'documentMessage.contextInfo.quotedMessage',
} as const

export const ContextInfoPaths = {
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.contextInfo',
  [ValidMessageTypes.imageMessage]: 'imageMessage.contextInfo',
  [ValidMessageTypes.videoMessage]: 'videoMessage.contextInfo',
  [ValidMessageTypes.documentMessage]: 'documentMessage.contextInfo',
} as const