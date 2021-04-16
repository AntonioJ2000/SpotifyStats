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
        this.http.get(endpoint,{},this.headerCurrentUser)
        .then(d=>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    public getCurrentUserSavedTracks():Promise<any | null>{
      return new Promise((resolve, reject)=>{
        const endpoint = environment.currentUserSavedTracks;
        this.http.get(endpoint,{}, this.headerSavedTracks)
        .then(d =>{
          if(d){
            resolve(JSON.parse(d.data))
          }else{
            resolve(null);
          }
        }).catch(err => reject(err))
      })
    }

    private get headerCurrentUser():any{
      return {
        'Authorization': this.getToken()
      }
    }

    private get headerSavedTracks():any{
      return {
        'Authorization': this.getToken()
      }
    }


    private getToken():string{
      return 'Bearer ' + this.clientCredentials.client.access_token
    }

}
