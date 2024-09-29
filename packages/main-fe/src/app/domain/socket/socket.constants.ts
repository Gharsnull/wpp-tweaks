export const SOCKET_EVENTS = {
  //Default io events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  //Custom events
  //emit events
  LOAD_CHATS: 'load-chats',
  START_SESSION: 'start-session',

  //on events
  QR_GENERATED: 'qr',
  CONNECTION_ID: 'connection-id',
  LOGGED_OUT: 'logged-out',
  CHATS_LOADED: 'chats-loaded',
}