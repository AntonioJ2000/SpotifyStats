import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private authService:AuthService,
              private clientCredentials:ClientcredentialsService,
              private loading:LoadingService,
              private router:Router) { }

  comprobadorToken:any = '';  

  async login(){ 
    this.loading.cargarLoading();
    setTimeout(() => {
      this.authService.login(); 
    }, 500);
      
    //Debería de parar el bucle cuando el token fuese distinto de ''
    /*
    while(this.comprobadorToken == ''){
      if(this.clientCredentials.client.access_token.length > 0){
        this.comprobadorToken = this.clientCredentials.client.access_token;
      }
    }
    */
    
  }
}
