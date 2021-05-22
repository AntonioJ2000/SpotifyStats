import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SpotifyApiService } from 'src/app/services/spotify-api.service';
import { ThemeService } from 'src/app/services/theme.service';


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
              private toastController: ToastController,
              private themeService: ThemeService) { }

  /**
   * If a user signed in before this, refreshToken should be taken to an instant sign in to the app
   * without giving credentials again to the server.
   */
  async ngOnInit(){
    try{
      this.storage.getItem('themeColor').then((data)=>{
        this.themeService.setThemeOnInit(data.theme)
      })

    }catch{
      console.log('Error al obtener color');
    }

    
    try{
      this.storage.getItem('visibleProfile').then((data)=>{
        this.clientCredentials.config.profileVisible = data.isVisible;
      })
    }catch{
      console.log('Error al obtener la preferencia')
    }
 
    try{
      this.storage.getItem('conditionsAccepted').then((data)=>{
        this.clientCredentials.config.topAlertAccepted = data.isAccepted;
      })
    }catch{
      console.log('Error al leer la configuración')
      this.clientCredentials.config.topAlertAccepted = false;
    }

    try{
      this.storage.getItem('topConfig').then((data)=>{
        this.clientCredentials.config.stats_cap = data.value;
      })
    }catch{
      console.log('Error al leer la configuración')
      this.clientCredentials.config.stats_cap = 20;
    }

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
      cssClass: 'myToastError',
      message: "Ha habido un error, por favor, revisa tu conexión a Internet o inténtalo de nuevo más tarde",
      duration: 2500,
      position:"bottom"
    });
    toast.present();
  }

}
