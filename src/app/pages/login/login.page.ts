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
              private loading:LoadingService) { }


  async login(){ 
    this.loading.cargarLoading();
    setTimeout(() => {
      this.authService.login(); 
    }, 250);
  }

  ionViewDidEnter(){
    this.loading.pararLoading();
  }
}
