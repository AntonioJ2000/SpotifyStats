import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { user } from '../model/user';
import { ClientcredentialsService } from './clientcredentials.service';


@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService { 

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

    public getRefreshedToken():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint=environment.getNewToken;
        this.http.post(endpoint, this.refreshBody, this.refreshHeader)
        .then((d)=>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null)
          }
        }).catch(err=> reject(err));
      })
    }

    private get refreshBody(){
      return {
        'grant_type' : 'refresh_token',
        'refresh_token' : this.clientCredentials.client.refresh_token,
      }
    }

    private get refreshHeader():any{
      return {
        'Authorization': 'Basic ' + btoa(environment.clientID + ':' + environment.clientSecret)  
      } 
    }

    public getAllUsers():Promise<user[] | null>{
      return new Promise((resolve, reject) => {
        const endpoint = environment.endpoint + environment.apiUser; //http://localhost:8080/user/
        this.http.get(endpoint, {}, this.header24)
        .then(d=>{
          if(d){
            console.log(JSON.parse(d.data))
            resolve(JSON.parse(d.data));
          }else{
            resolve(null);
          }
        })
        .catch(err=>reject(err))
      })
    }

    private get header24():any{
      return {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    }
}
