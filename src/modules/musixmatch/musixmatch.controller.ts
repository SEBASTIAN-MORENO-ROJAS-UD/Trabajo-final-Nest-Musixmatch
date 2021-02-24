import { Controller, Get, Query, Param, Post, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MusixmatchService } from './musixmatch.service';
import { FirebaseService } from "../../shared/firebase/firebase.service";

@ApiTags('musixmatch')
@Controller('musixmatch')
export class MusixmatchController {

    constructor( private readonly MusixmatchService: MusixmatchService, private fireService: FirebaseService){}

    //////////Endpoints para la CRUD en la base de datos//////////

    //Obtener todos los registros de la base de datos
    @Get('GetAllFireBase')
    getAll(){
        return this.fireService.getAll()
    }

    //Obtener un registro de la base de datos
    @Get('getOneFireBase/:idRegistro')
    getOne(@Param('idRegistro') id:string){
        return this.MusixmatchService.getOne(id)
    }

    //Guardar una cancion en la base de datos
    @Post('guardarCancion/:idCancion')
    guardarCancion(@Param('idCancion') id:number){
        return this.MusixmatchService.guardarDatos(id)
    }

    @Put('actualizarVersionesCanciones/:idRegistro/:nombreCancion/:nombreArtista')
    guardarVersionesCancion(@Param('idRegistro') id:number, @Param('nombreCancion') cancion:string, @Param('nombreArtista') artista:string, @Query('limiteResultados') limite:number){
        return this.MusixmatchService.actualizarDatos(id, cancion, artista, limite)
    }

    @Delete('Delete/:idRegistro')
    delete(@Param('idRegistro') id:string){
        return this.delete(id)
    }


    //////////Endpoints para buscar información de musixmatch//////////

    //Buscar una cancion por su id
    @Get('CancionById/:idCancion')
    getCancionById(@Param('idCancion') id:number){
        return this.MusixmatchService.getCancionById(id)
    }

    //Buscar una cancion por el nombre de la cancion y el nombre del artista
    @Get('CancionByNombreAndByArtist/:nombreCancion/:nombreArtista')
    getCancionByNombre(@Param('nombreCancion') cancion:string, @Param('nombreArtista') artista:string){
        return this.MusixmatchService.getCancionesByNombreAndByArtist(cancion, artista)
    }

    //Buscar canciones que coincidan con el nombre de la cancion y del artista
    @Get('VersionesCanciones/:nombreCancion/:nombreArtista')
    getVersionesCanciones(@Param('nombreCancion') cancion:string, @Param('nombreArtista') artista:string,  @Query('limiteResultados') limite:number){
        return this.MusixmatchService.getVersionesCancion(cancion, artista, limite)
    }

    
    @Get('ParaPruebas')
    getAlbum(){
        return this.MusixmatchService.get('track.search?q_track=Alejandro&f_artist_id=378462&page_size=100')
    }
}