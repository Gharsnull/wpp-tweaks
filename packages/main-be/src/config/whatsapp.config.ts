export default {
  useStore: process.env.USE_STORE === 'true',
  doReplies: process.env.DO_REPLIES === 'true',
  usePairingCode: process.env.USE_PAIRING_CODE === 'true',
  loggerPath: process.env.LOGGER_PATH,
};
