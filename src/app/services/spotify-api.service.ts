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


    /**
     * HTTP request that gets the signed in client profile. 
     * @returns The parameters of the profile, image, displayName, and more.
     */
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

    /**
     * HTTP request that gets the signed client saved tracks in Spotify (liked songs).
     * @param offsetVar Variable that helps out giving next 20 songs from the API.
     * @returns Array with the last 20 saved client tracks.
     */
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

    /**
     * HTTP request that gets the current client most played tracks in a selected time range, this parameter can be:
       - short_term: 4 weeks. 
       - medium_term: 6 months.
       - long_term: since the account was created.
     * @returns 20 most played tracks of the current client.
     */
    public getCurrentUserTopTracks():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'tracks?' + 'time_range=' + this.clientCredentials.config.time_range + '&limit=' + this.clientCredentials.config.stats_cap;
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

    /**
     * HTTP request that gets the current client most listened artists in a selected time range. 
     * @returns 20 most listened artists of the current client
     */
    public getCurrentUserTopArtists():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'artists?' + 'time_range=' + this.clientCredentials.config.time_range + '&limit=' + this.clientCredentials.config.stats_cap;
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

    /**
     * HTTP request that gets the current client top 3 artists since the creation of the acount
     * @returns The artist
     */
    public getCurrentUserTop3Artist():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'artists?' + 'time_range=long_term&limit=3';
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

    /**
     * HTTP request that gets the current clent top 3 tracks since the creation of the account
     * @returns The track
     */
    public getCurrentUserTop3Songs():Promise<any | null>{
      return new Promise((resolve,reject)=>{
        const endpoint = environment.currentUserTop + 'tracks?' + 'time_range=long_term&limit=3';
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

    /**
     * HTTP request that gets the current client recently played tracks.
     * @returns 10 last played tracks.
     */
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

    /**
     * Uses the client refreshToken to get back a new accessToken
     * @returns new accessToken
     */
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

}
