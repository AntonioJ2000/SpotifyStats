import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SpotifyApiService } from 'src/app/services/spotify-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {

  constructor(private authService:AuthService,
              private loading:LoadingService,
              private clientCredentials:ClientcredentialsService,
              private spotifyApi:SpotifyApiService,
              private storage:NativeStorage,
              private toastController: ToastController) { }

  /**
   * If a user signed in before this, refreshToken should be taken to an instant sign in to the app
   * without giving credentials again to the server.
   */
  async ngOnInit(){
    try{
    await this.storage.getItem('refreshToken').then(
      async(data)=>{
        
          try{
          this.clientCredentials.client.refresh_token = data.encryptedRefreshToken;
          let refreshedToken = await this.spotifyApi.getRefreshedToken();
          this.clientCredentials.client.access_token = refreshedToken.access_token;
                  
          this.authService.loginNative(); 
          }catch{
            await this.errorToast();
          }        
      })
      
        }catch(err){
          console.log('Storage Error')
        }
  }

  /**
   * Log in the user to the app. If all works good, this should be used only one time.
   */
  async login(){ 
    this.loading.cargarLoading();
    this.authService.login();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      cssClass: 'myToastLoginError',
      message: "Ha habido un error, por favor, revisa tu conexión a Internet o inténtalo de nuevo más tarde",
      duration: 2500,
      position:"bottom"
    });
    toast.present();
  }

}
