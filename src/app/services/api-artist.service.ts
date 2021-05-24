import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { artist } from '../model/artist';

@Injectable({
  providedIn: 'root'
})
export class ApiArtistService {

  constructor(private http:HTTP) { }

  /**
   * Método que devuelve todos los artistas de la base de datos
   */
  public getAllArtists():Promise<artist[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiArtist;
      this.http.get(endpoint, {}, this.header)
      .then(d=>{
        if(d){
          resolve(JSON.parse(d.data));
        }else{
          resolve(null);
        }
      })
      .catch(err=>reject(err))
    })
  }

  /**
   * Método que crea un artista
   * @param artist el artista a crear
   */
  public createArtist(artist:artist): Promise<void>{
    const endpoint = environment.endpoint + environment.apiArtist;
    return new Promise((resolve, reject) => {
      if(artist){
        this.http.setServerTrustMode('nocheck');
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, artist, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("Artist no exists");
      }
    })
  }

  /**
   * Método que devuelve un artista en específico
   * @param id el id del artista
   */
  public getArtist(id?:number | string): Promise<artist | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiUser;
      if(id){
        endpoint+=id;
      }
      this.http
        .get(endpoint, {}, this.header)
        .then(d => {
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err => reject(err));
    })
  }
 
  /**
   * Método que borra un artista en especifíco
   * @param artist el artista a borrar
   */
  public removeArtist(artist:artist): Promise<void> {
    const id:any = artist.id ? artist.id : artist;
    const endpoint = environment.endpoint + environment.apiArtist + id;
    return new Promise((resolve, reject) => {
      this.http
        .delete(endpoint, {}, this.header)
        .then(d => {
          resolve();
        })
        .catch(err => reject(err));
    })
  }

  /**
   * Método que modifica un artista en específico
   * @param artist artista a modificar
   */
  public updateArtist(artist: artist): Promise<void> {
    const endpoint = environment.endpoint + environment.apiArtist;
    return new Promise((resolve, reject) => {
      if(artist){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, artist, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      }else{
        reject("User no exists");
      }
    })
  }
  
  private get header():any{
    return {
      "Access-Control-Allow-Origin": "*",
      "apikey": btoa("spotifystatsapikey")
    }
  }
}
