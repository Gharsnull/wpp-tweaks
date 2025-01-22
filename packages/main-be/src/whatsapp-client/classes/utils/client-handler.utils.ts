export const normalizeJid = (jid: string) => {
  const parts = jid.split(':');
  return parts[0] + '@s.whatsapp.net';
}

export const jidToNumber = (jid: string) => {
  return jid.split('@')?.[0];
}
