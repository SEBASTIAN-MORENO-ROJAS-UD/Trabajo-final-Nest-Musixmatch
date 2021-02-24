import { Module, HttpModule } from '@nestjs/common';
import { MusixmatchController } from './musixmatch.controller';
import { MusixmatchService } from './musixmatch.service';
import { FirebaseService } from '../../shared/firebase/firebase.service';

@Module({
  imports: [HttpModule],
  controllers: [MusixmatchController],
  providers: [MusixmatchService, FirebaseService]
})
export class MusixmatchModule {

}
