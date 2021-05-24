import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ClientcredentialsService } from './clientcredentials.service';
import { LoadingService } from './loading.service';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  constructor(private clientCredentials:ClientcredentialsService,
              private router:Router,
              private storage:NativeStorage,
              private toastController:ToastController,
              private loading:LoadingService,
              private navCtrl: NavController) { }

  /**
   * Logs in the client into the Ionic App using his Spotify Account via Spotify API.

   * There are different manners to communicate with the Spotify API to make request, the followed one
     used in this app is the "Authorization Code Flow" (https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow).
    
   * This function requires some parameters, as the documentation explains, these parameters are:
     - clientId: ClientID (Developer client ID) that Spotify gives you when the app is created in the Dashboard.
     - redirectUrl: When used CustomURL Schema, where is the info going to be returned when the login is success or failure.
     - scopes: Security scopes just to notify the user what the application is able to do with his information
     - tokenExchangeUrl: The Ionic app comunicates with the Heroku created server side (Node App) where the endpoint /exchange, gets
       a token to work and make request to the Spotify API.
     - tokenRefreshUrl: Same as the /exchange endpoint but this time, /refresh does provide a new token via refreshToken (Not working in the flow) 
   
   * In case that all works out correctly, the client should get from the server these 3 parameters:
     - accessToken: Required to make requests to the API, expires in a limited period of time.
     - encryptedRefreshToken: Required to obtain a new accessToken to work with.
     - expiresAt (Not used): Gives you more information about when is stop working our accessToken
   */
  public login(){
    const config = {
      clientId: "6c3f918a4ab240db97b1c104475c8ea6",
      redirectUrl: "spotifystats://callback",
      scopes: ["user-read-recently-played", "playlist-read-private", "playlist-read-collaborative", "user-top-read", "user-library-read"],
      tokenExchangeUrl: "https://ajsstats.herokuapp.com/exchange",
      tokenRefreshUrl: "https://ajsstats.herokuapp.com/refresh"
    };

    cordova.plugins.spotifyAuth.authorize(config)
    .then(({ accessToken, encryptedRefreshToken, expiresAt }) =>{
       //Sobreescribimos las variables del cliente
        this.clientCredentials.client.access_token = accessToken;
        this.clientCredentials.client.refresh_token = encryptedRefreshToken;
      
      this.storage.setItem('refreshToken',{encryptedRefreshToken}).then(()=>{
        if(this.clientCredentials.client.access_token != ''){
          this.navCtrl.navigateRoot(['/']);
        }
      })
    });  
  }
  

  /**
   * Logs the client with the native storage skipping the normal login with the button.
   */
  public loginNative(){
    if(this.clientCredentials.client.refresh_token != ''){
      this.navCtrl.navigateRoot(['/']);
    }
  }

  /**
   * Forgets the account used to log in to the app.
   */
  public logout(){
    cordova.plugins.spotifyAuth.forget();
    this.clientCredentials.forgetToken();

    setTimeout(() => {
        this.navCtrl.navigateBack(['/login'])
      },750);
  }

   canActivate(route: ActivatedRouteSnapshot): boolean {
      if(!this.isLogged()){
        this.navCtrl.navigateRoot(['/login']);
        return false;
      }
        return true;
    }

    public isLogged(): boolean {
      if (this.clientCredentials.client.refresh_token == '') {
        return false;
      } else {
        return true;
      }
    }

    async errorToastSignInButton() {
      const toast = await this.toastController.create({
        cssClass: 'myToastLoginError',
        message: "Ha habido un error, por favor, revisa tu conexión a Internet o inténtalo de nuevo más tarde",
        duration: 2000,
        position:"bottom"
      });
      toast.present();
    }



}
