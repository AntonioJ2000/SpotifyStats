import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class ApiTrackService {

  constructor(private http:HTTP) { }

  /**
   * HTTP request that get all saved tracks in the database
   * @returns saved tracks (Array)
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
   * HTTP request that creates a new track in the database
   * @param track track to save
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
        reject("Track does not exists");
      }
    })
  }

  /**
   * HTTP request that get a track with a selected id
   * @param id id of the track we want to get
   * @returns 
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
   * HTTP request that removes a track from the database
   * @param track selected track to remove
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
   * HTTP request that update a track from the database
   * @param track selected track to update
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
        reject("Track does not exists");
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
