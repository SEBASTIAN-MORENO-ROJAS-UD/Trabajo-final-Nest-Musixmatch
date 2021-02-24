import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { FirebaseService } from "../../shared/firebase/firebase.service";
import { map } from 'rxjs/operators';

@Injectable()
export class MusixmatchService {

    url: string = 'https://api.musixmatch.com/ws/1.1/'

    apiKey:string = 'b1442523e27aa338132e2c10774d3b17'

    urlArtista:string = 'https://api.musixmatch.com/ws/1.1/artist.get?artist_id='

    urCancion:string = 'https://api.musixmatch.com/ws/1.1/track.get?commontrack_id='

    constructor(private http: HttpService, private fireService: FirebaseService){}

    //////////Funciones para la CRUD en la base de datos//////////

    //Obtener todos los registros de la base de datos
    get( endpoint: string){
        return this.http.get(`${this.url}${endpoint}&apikey=${this.apiKey}`)
        .pipe( map( response => response.data ) )
    }

    //Obtener un registro de la base de datos
    getOne(id){
        return this.fireService.getOne(id)
    }

    //Guardar una cancion en la base de datos
    async guardarDatos(id:number){

        try{
            const cancion = await this.get(`track.get?commontrack_id=${id}`).toPromise()
        
            const track_name = cancion.message.body.track.track_name
            const commontrack_id = cancion.message.body.track.commontrack_id
            const album_id = cancion.message.body.track.album_id
            const album_name = cancion.message.body.track.album_name
            const artist_id = cancion.message.body.track.artist_id
            const artist_name = cancion.message.body.track.artist_name
            const update_time = cancion.message.body.track.updated_time
            const has_lyrics = cancion.message.body.track.has_lyrics
            const track_share_url = cancion.message.body.track.track_share_url

            var jsonRespuesta={'commontrack_id':commontrack_id, 'track_name':track_name, 'artist_id':artist_id, 'artist_name':artist_name,
            'album_id':album_id, 'album_name':album_name, 'update_time':update_time, 'has_lyrics':has_lyrics, 'track_share_url':track_share_url};

            return this.fireService.post(jsonRespuesta)
        }
        catch(error){
            throw new HttpException('Fallo en encontrar la cancion a guardar', 210)
        }
    }
    
    //Actualizar las versiones de una cancion
    async actualizarDatos(idRegistro:number, nombre:string , artista:string, limite:number){
        try{

            const registro = await this.getOne(idRegistro).toPromise()
            const lista_canciones = await this.getVersionesCancion(nombre, artista, limite)

            if(lista_canciones!='No se pudo encontrar las versiones de la canción'){
                
                const track_name = registro.track_name
                const commontrack_id = registro.commontrack_id
                const album_id = registro.album_id
                const album_name = registro.album_name
                const artist_id = registro.artist_id
                const artist_name = registro.artist_name
                const update_time = registro.updated_time
                const has_lyrics = registro.has_lyrics
                const track_share_url = registro.track_share_url

                var jsonRespuesta={'commontrack_id':commontrack_id, 'track_name':track_name, 'artist_id':artist_id, 'artist_name':artist_name,
                'album_id':album_id, 'album_name':album_name, 'update_time':update_time, 'has_lyrics':has_lyrics, 'track_share_url':track_share_url,
                'versiones_cancion':lista_canciones.lista_canciones};

                return this.fireService.put(idRegistro, jsonRespuesta)
            }
            else{
                return 'No se pudo encontrar la cancion o sus versiones de para agregarlas'
            }
        }
        catch(error){
            throw new HttpException('Fallo en encontrar el registro en la base de datos', 540)
        }
    }

    //////////Funciones para buscar información de musixmatch//////////

    //Buscar una cancion por su id
    getCancionById(id:number){
        const cancion = this.get(`track.get?commontrack_id=${id}`)

        return cancion
    }

    //Buscar una cancion por el nombre de la cancion y el nombre del artista
    async getCancionesByNombreAndByArtist(nombre:string , artista:string){
        try{
            const resultados = await this.get(`track.search?q_track=${nombre}&q_artist=${artista}&page_size=100`).toPromise()

            const tamaño = resultados.message.body.track_list.length

            var comprobacion = false

            const nombreCancion = nombre.toLowerCase()
            const nombreArtista = artista.toLowerCase()

            for(let i=0; i<tamaño; i++){

                const track_name = resultados.message.body.track_list[i].track.track_name.toLowerCase()
                const artist_name = resultados.message.body.track_list[i].track.artist_name.toLowerCase()

                if(track_name==nombreCancion && artist_name==nombreArtista){
                    comprobacion = true

                    const track_name = resultados.message.body.track_list[i].track.track_name
                    const commontrack_id = resultados.message.body.track_list[i].track.commontrack_id
                    const album_id = resultados.message.body.track_list[i].track.album_id
                    const album_name = resultados.message.body.track_list[i].track.album_name
                    const artist_id = resultados.message.body.track_list[i].track.artist_id
                    const artist_name = resultados.message.body.track_list[i].track.artist_name
                    const update_time = resultados.message.body.track_list[i].track.updated_time
                    const has_lyrics = resultados.message.body.track_list[i].track.has_lyrics
                    const track_share_url = resultados.message.body.track_list[i].track.track_share_url

                    var jsonRespuesta = {'commontrack_id':commontrack_id, 'track_name':track_name, 'artist_id':artist_id, 'artist_name':artist_name,
                    'album_id':album_id, 'album_name':album_name, 'update_time':update_time, 'has_lyrics':has_lyrics, 'track_share_url':track_share_url}

                    break;
                }
            }
            if(comprobacion){
                return jsonRespuesta
            }
            else{
                return 'No se pudo encontrar la canción'
            }
        }
        catch(error){
            throw new HttpException('Fallo en encontrar el nombre de la cancion o el artista', 240)
        }
    }

    //Buscar canciones que coincidan con el nombre de la cancion y del artista
    async getVersionesCancion(nombre:string , artista:string, limite:number){
        try{
            const resultados = await this.get(`track.search?q_track=${nombre}&q_artist=${artista}&page_size=${limite}`).toPromise()

            const tamaño = resultados.message.body.track_list.length

            const lista=[]

            var comprobacion = false

            var jsonRespuesta={'lista_canciones':lista};

            const nombreCancion = nombre.toLowerCase()
            const nombreArtista = artista.toLowerCase()

            for(let i=0; i<tamaño; i++){

                const track_name = resultados.message.body.track_list[i].track.track_name.toLowerCase()
                const artist_name = resultados.message.body.track_list[i].track.artist_name.toLowerCase()

                if(nombreCancion==track_name && nombreArtista==artist_name){     
                    
                }
                else{
                    comprobacion = true

                    const track_name = resultados.message.body.track_list[i].track.track_name
                    const commontrack_id = resultados.message.body.track_list[i].track.commontrack_id
                    const album_id = resultados.message.body.track_list[i].track.album_id
                    const album_name = resultados.message.body.track_list[i].track.album_name
                    const artist_id = resultados.message.body.track_list[i].track.artist_id
                    const artist_name = resultados.message.body.track_list[i].track.artist_name
                    const update_time = resultados.message.body.track_list[i].track.updated_time
                    const has_lyrics = resultados.message.body.track_list[i].track.has_lyrics
                    const track_share_url = resultados.message.body.track_list[i].track.track_share_url

                    var json = {'commontrack_id':commontrack_id, 'track_name':track_name, 'artist_id':artist_id, 'artist_name':artist_name,
                    'album_id':album_id, 'album_name':album_name, 'update_time':update_time, 'has_lyrics':has_lyrics, 'track_share_url':track_share_url}

                    jsonRespuesta['lista_canciones'].push(json)
                }
            }
            if(comprobacion){
                return jsonRespuesta
            }
            else{
                return 'No se pudo encontrar las versiones de la canción'
            }
        }
        catch(error){
            throw new HttpException('Fallo en encontrar el nombre de la cancion o el artista', 240)
        }
    }

    
    async listaArtistas(idArtista:number, cantidad:number){
        try {
            const lista=[]

            let i=0

            for(i=0; i<cantidad; i++){
                const artista = await this.getArtista(idArtista).toPromise()
                
                lista[i]=artista
                idArtista++
            }
            const array = lista.map( datoMap => datoMap.message.body.artist.artist_name)
            return array
        }
        
        catch (error) {
            throw new HttpException('Fallo de la aplicacion', 480)
        }
    }

    getArtista(id:number){
        try {
            const artista = this.http.get(`${this.urlArtista}${id}&apikey=${this.apiKey}`)
            .pipe( map( response => response.data ) )

            return artista
        }
        catch (error) {
            throw new HttpException('Fallo en encontrar el artista', 240)
        }
        
    }

    async prueba(id:number){

        const artista = await this.getArtista(id).toPromise()

        const lista=[]
        lista[0]=artista

        const ide = lista.map( datoMap => datoMap.message.body.artist.artist_id)
        const nombre = lista.map( datoMap => datoMap.message.body.artist.artist_name)

        console.log(ide)
        console.log(nombre)
        

        var json={datos:[{nombre :''},{apellido:''},{ciudad:''}]}

        return this.fireService.getAll()
    }
}
