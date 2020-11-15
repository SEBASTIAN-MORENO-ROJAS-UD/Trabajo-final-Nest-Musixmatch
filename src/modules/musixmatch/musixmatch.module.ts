import { Module } from '@nestjs/common';
import { MusixmatchService } from './musixmatch.service';

@Module({
  providers: [MusixmatchService]
})
export class MusixmatchModule {}
