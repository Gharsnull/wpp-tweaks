import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappClientModule } from './whatsapp-client/whatsapp-client.module';

@Module({
  imports: [WhatsappClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
