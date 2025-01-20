import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappClientModule } from './whatsapp-client/whatsapp-client.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupModule } from './group/group.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandConfigurationModule } from './command-configuration/command-configuration.module';
import { GroupConfigurationModule } from './group-configuration/group-configuration.module';
import { CommandModule } from './command/command.module';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [
    WhatsappClientModule,
    EventEmitterModule.forRoot(),
    GroupModule,
    MongooseModule.forRoot(mongoConfig.mongoUri),
    CommandConfigurationModule,
    GroupConfigurationModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
