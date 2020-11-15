import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusixmatchController } from './modules/musixmatch/musixmatch.controller';
import { MusixmatchModule } from './modules/musixmatch/musixmatch.module';

@Module({
  imports: [MusixmatchModule],
  controllers: [AppController, MusixmatchController],
  providers: [AppService],
})
export class AppModule {}
