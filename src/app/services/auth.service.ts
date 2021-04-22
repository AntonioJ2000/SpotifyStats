import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { ClientcredentialsService } from './clientcredentials.service';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  constructor(private clientCredentials:ClientcredentialsService,
              private router:Router) { }

 ready:boolean = false;

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!this.ready){
      this.router.navigate(['/login']);
      return false;
    }else{
      return true;
    }
  }

  public login():number{
    const config = {
      clientId: "6c3f918a4ab240db97b1c104475c8ea6",
      redirectUrl: "spotifystats://callback",
      scopes: ["user-read-recently-played", "streaming", "playlist-read-private", "playlist-read-collaborative", "user-top-read", "user-library-read"],
      tokenExchangeUrl: "https://ajsstats.herokuapp.com/exchange",
      tokenRefreshUrl: "https://ajsstats.herokuapp.com/refresh"
    };

    cordova.plugins.spotifyAuth.authorize(config)
    .then((data) =>{
       //Sobreescribimos las variables del cliente
       this.clientCredentials.client.access_token = data.accessToken;
       this.clientCredentials.client.encrypted_refresh_token = data.encryptedRefreshToken;
       this.clientCredentials.client.expires_in = data.expiresAt
    });

      do{
        //Nada, a esperar el token
        setTimeout(() => {
          console.log('Sin token')
        }, 1000); 
      }while(this.clientCredentials.client.access_token = ''); 
      
      this.ready = true;
      return 1;  

  }

  public logout(){
    cordova.plugins.spotifyAuth.forget();
    this.clientCredentials.logout();
    this.ready = false;

    if(this.clientCredentials.client.access_token = ''){
      this.router.navigate(['/login'])
    }
  }

}
