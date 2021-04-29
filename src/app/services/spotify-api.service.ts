import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { ClientcredentialsService } from './clientcredentials.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  token:any = this.clientCredentials.client.access_token; 

  constructor(private clientCredentials:ClientcredentialsService,
              private http:HTTP) { }


    public getCurrentUserProfile():Promise<any | null>{
      return new Promise((resolve, reject)=>{
        const endpoint = environment.currentUserEndpoint;
        this.http.get(endpoint,{},this.header)
        .then(d=>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    public getCurrentUserSavedTracks(offsetVar:number):Promise<any | null>{
      return new Promise((resolve, reject)=>{
        const endpoint = environment.currentUserSavedTracks + '?offset=' + offsetVar;
        this.http.get(endpoint,{}, this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    public getCurrentUserTopTracks():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'tracks?' + 'time_range=' + this.clientCredentials.config.time_range;
        this.http.get(endpoint,{},this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    public getCurrentUserTopArtists():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'artists?' + 'time_range=' + this.clientCredentials.config.time_range;
        this.http.get(endpoint,{},this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        }).catch(err => reject(err));
      })
    }

    public getCurrentUserFavouriteArtist():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'artists?' + 'time_range=long_term&limit=1';
        this.http.get(endpoint,{},this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        }).catch(err => reject(err));
      })
    }

    public getCurrentUserFavouriteSong():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'tracks?' + 'time_range=long_term&limit=1';
        this.http.get(endpoint,{},this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        }).catch(err => reject(err));
      })
    }

    public getCurrentUserRecentlyPlayed():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserRecentlyPlayed+ '?' + 'limit=' + '10';
        this.http.get(endpoint,{},this.header)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    private get header():any{
      return {
        'Authorization': this.getToken()
      }
    }



    private getToken():string{
      return 'Bearer ' + this.clientCredentials.client.access_token
    }

}
