import { Controller, Get, Param } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MusixmatchService } from './musixmatch.service';

@ApiTags('musixmatch')
@Controller('musixmatch')
export class MusixmatchController {

    constructor( private readonly MusixmatchService: MusixmatchService){}

    @Get('Artista/:id')
    getArtista(@Param('id') id:number){
        return this.MusixmatchService.getArtista(id)
    }

    @Get('Album')
    getAlbum(){
        return this.MusixmatchService.get('album.get?album_id=14250417')
    }

    @Get('listaArtistas/:idArtista/:cantidad')
    crearLista(@Param('idArtista') idArtista:number, @Param('cantidad') cantidad:number){
        return this.MusixmatchService.listaArtistas(idArtista, cantidad)
    }
}