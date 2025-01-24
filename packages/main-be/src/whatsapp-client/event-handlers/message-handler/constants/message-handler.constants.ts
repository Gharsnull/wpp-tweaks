export enum ValidMessageTypes {
  conversation = "conversation",
  extendedTextMessage = "extendedTextMessage",
  imageMessage = "imageMessage",
  videoMessage = "videoMessage",
  stickerMessage = "stickerMessage",
  audioMessage = "audioMessage",
}

export const ContentTypeTextPaths = {
  [ValidMessageTypes.conversation]: 'conversation',
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.text',
  [ValidMessageTypes.imageMessage]: 'imageMessage.caption',
  [ValidMessageTypes.videoMessage]: 'videoMessage.caption',
} as const

export const ContenTypeMentionedJidPaths = {
  [ValidMessageTypes.extendedTextMessage]: 'extendedTextMessage.contextInfo.mentionedJid',
  [ValidMessageTypes.imageMessage]: 'imageMessage.contextInfo.mentionedJid',
  [ValidMessageTypes.videoMessage]: 'videoMessage.contextInfo.mentionedJid',
} as const