import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class ApiSongService {

  constructor(private http:HTTP) { }

  /**
   * Método que devuelve todos las canciones de la base de datos
   */
   public getAllTracks():Promise<track[] | null>{
    return new Promise((resolve, reject) => {
      const endpoint = environment.endpoint + environment.apiTrack;
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
   * Método que crea una cancion
   * @param track la cancion a crear
   */
  public createTrack(track:track): Promise<void>{
    const endpoint = environment.endpoint + environment.apiTrack;
    return new Promise((resolve, reject) => {
      if(track){
        this.http.setDataSerializer('json'); 
        this.http
          .post(endpoint, track, this.header)
          .then(d => {
            resolve();
          })
          .catch(err => reject(err));
      } else{
        reject("User no exists");
      }
    })
  }

  /**
   * Método que devuelve una cancion en específico
   * @param track el id de la cancion
   */
  public getTrack(id?:number | string): Promise<track | null>{
    return new Promise((resolve, reject) => {
      let endpoint = environment.endpoint + environment.apiTrack;
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
   * Método que borra una cancion en especifíco
   * @param track la cancion a borrar
   */
  public removeTrack(track:track): Promise<void> {
    const id:any = track.id ? track.id : track;
    const endpoint = environment.endpoint + environment.apiTrack + id;
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
   * Método que modifica una cancion en específico
   * @param track cancion a modificar
   */
  public updateTrack(track: track): Promise<void> {
    const endpoint = environment.endpoint + environment.apiTrack;
    return new Promise((resolve, reject) => {
      if(track){
        this.http.setDataSerializer('json');
        this.http
          .put(endpoint, track, this.header)
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
      "Content-Type": "application/json"
    }
  }
}
