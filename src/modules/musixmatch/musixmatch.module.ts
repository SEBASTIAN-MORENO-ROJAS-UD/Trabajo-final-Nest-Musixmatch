import { Module, HttpModule } from '@nestjs/common';
import { MusixmatchController } from './musixmatch.controller';
import { MusixmatchService } from './musixmatch.service';

@Module({
  imports: [HttpModule],
  controllers: [MusixmatchController],
  providers: [MusixmatchService]
})
export class MusixmatchModule {

}
