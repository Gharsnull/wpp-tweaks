import { Controller, Get } from '@nestjs/common';

@Controller('whatsapp-client')
export class WhatsappClientController {
  @Get('qr')
  getQRCode() {}
}
