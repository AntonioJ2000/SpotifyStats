import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
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
              private storage:NativeStorage) { }

  async ngOnInit(){
    await this.storage.getItem('refreshToken').then(
      async(data)=>{
        try{
          this.clientCredentials.client.refresh_token = data.encryptedRefreshToken;

          let refreshedToken = await this.spotifyApi.getRefreshedToken();
          this.clientCredentials.client.access_token = refreshedToken.access_token;
                     
          this.authService.loginNative();        
        }catch(err){
          console.log('Storage Error')
        }
    })
  }

  async login(){ 
    setTimeout(() => {
      this.authService.login(); 
    }, 250);
  }


}
