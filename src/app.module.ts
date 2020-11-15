import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusixmatchModule } from './modules/musixmatch/musixmatch.module';


@Module({
  imports: [HttpModule, MusixmatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
