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


  async login(){
    await this.loading.cargarLoading();
    let success = this.authService.login();
    if(success = 1){
      setTimeout(async() => {
        this.router.navigate(['/']);
      }, 1000);
      
      setTimeout(async() => {
        await this.loading.pararLoading();
      }, 2000);   
    }
  }
}
