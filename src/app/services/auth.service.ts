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


  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!this.isLogged()){
      this.router.navigate(['/login']);
      return false;
    }else{
      return true;
    }
  }

  public isLogged(): boolean{
    if(this.clientCredentials.client.access_token == ''){
      return false;
    }else{
      return true;
    }
  }

  public login(){
    const config = {
      clientId: "6c3f918a4ab240db97b1c104475c8ea6",
      redirectUrl: "spotifystats://callback",
      scopes: ["user-read-recently-played", "streaming", "playlist-read-private", "playlist-read-collaborative", "user-top-read", "user-library-read"],
      tokenExchangeUrl: "https://ajsstats.herokuapp.com/exchange",
      tokenRefreshUrl: "https://ajsstats.herokuapp.com/refresh"
    };

    cordova.plugins.spotifyAuth.authorize(config)
    .then(({ accessToken, encryptedRefreshToken, expiresAt }) =>{
       //Sobreescribimos las variables del cliente
      this.clientCredentials.client.access_token = accessToken;
      
      if(this.clientCredentials.client.access_token != ''){
        this.router.navigate(['/']);
      }
    });
  }

  public logout(){
    cordova.plugins.spotifyAuth.forget();
    this.clientCredentials.forgetToken();

    setTimeout(() => {
        this.router.navigate(['/login'])
      },1000);
  }

}
