import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from '../../constants/command.constants';
import { CommandPayload } from '../../interfaces/command.interfaces';

@Injectable()
export class PingHandlerService {
  constructor() {}

  @OnEvent(Commands.PING)
  handlePing(payload: CommandPayload) {
    const {
      groupJid,
      WaMessage,
      client,
    } = payload;

    client._wppSocket.sendMessage(
      groupJid,
      { text: 'Pong!' },
      { quoted: WaMessage }
    );
  }
}
