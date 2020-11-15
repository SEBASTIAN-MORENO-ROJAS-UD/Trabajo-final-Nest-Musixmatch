import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class MusixmatchService {

    url: string = 'https://api.musixmatch.com/ws/1.1/'

    apiKey:string = 'b1442523e27aa338132e2c10774d3b17'

    urlArtista:string = 'https://api.musixmatch.com/ws/1.1/artist.get?artist_id='

    constructor(private http: HttpService ){
        
    }

    get( endpoint: string){
        return this.http.get(`${this.url}${endpoint}&apikey=${this.apiKey}`)
        .pipe( map( response => response.data ) )
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
}
