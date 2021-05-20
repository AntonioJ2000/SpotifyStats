import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage {

  booleanToView
  toggleChecked:boolean = this.clientCredentials.config.profileVisible;
  statsCap:number = this.clientCredentials.config.stats_cap;
  conditionsAccepted:boolean = this.clientCredentials.config.topAlertAccepted;

  constructor(private router:Router,
              private alertController:AlertController,
              private actionSheetController:ActionSheetController,
              private themeService:ThemeService,
              private storage:NativeStorage,
              private clientCredentials:ClientcredentialsService,
              private loading:LoadingService,
              private apiUser:ApiUserService,
              private navCtrl:NavController) {  }

  closeConfigPage(){
    this.navCtrl.navigateRoot(['/tabs/tab3'])
  }

  deleteUserAccount(){
    //Borrar al usuario de la base de datos y sacarlo al login.
  }

  async makeUserProfileVisibleSocial(){
    this.loading.cargarLoading();
    setTimeout(async() => {
    this.toggleChecked = !this.toggleChecked;
    this.clientCredentials.config.profileVisible = !this.clientCredentials.config.profileVisible;
    
    try{
      if(this.toggleChecked){  
            this.storage.setItem('visibleProfile',{isVisible: true})
            this.loading.pararLoading();
        }
    }catch{
        this.loading.pararLoading();
    }

    try{
      if(!this.toggleChecked){
        if(await this.apiUser.getUser(this.clientCredentials.user.id)){
          await this.apiUser.removeUser(this.clientCredentials.user.id).then(()=>{
            this.storage.setItem('visibleProfile',{isVisible: false})
            this.loading.pararLoading();
          });
        } 
      }
    }catch{
      this.storage.setItem('visibleProfile',{isVisible: false})
      this.loading.pararLoading();
      console.log('El usuario no existe')
    }
    }, 1000);
  }


  async alertConfirmDeleteSocialProfile(){
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: 'Eliminar cuenta',
      message:'¿Estás seguro/a de que deseas eliminar tu cuenta?, podrás recuperarla en el futuro y tu perfil de Spotify no se verá alterado.',
      buttons: [
        {
          text: "Cancelar",
          role: 'nothing',
          cssClass: 'alertOK'
        },{
          text: "Borrar",
          role: 'delete profile',
          cssClass: 'alertDELETE',
          handler: () => {
            //Borrar perfil
            this.deleteUserAccount();
          }
        }
      ]
    });
      
    await alert.present();
  }

  async colorSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Temas',
      cssClass: 'config-sheet',
      buttons: [{
          text: 'Verde (por defecto)',
          icon: 'assets/green.svg',
          handler: ()=>{
            this.themeService.enableDefault();
            this.storage.remove('themeColor')
        }
      },
        {
          text: 'Blanco',
          icon: 'assets/white.svg',
          handler: ()=>{
            this.themeService.enableWhite();
            this.storage.setItem('themeColor', {theme:'white-theme'})
        }
      },
        {
          text: 'Amarillo',
          icon: 'assets/yellow.svg',
          handler: ()=>{
           this.themeService.enableYellow();
           this.storage.setItem('themeColor',{theme:'yellow-theme'})
        }
      },
        {
          text: 'Naranja',
          icon: 'assets/orange.svg',
          handler: ()=>{
            this.themeService.enableOrange();
            this.storage.setItem('themeColor',{theme:'orange-theme'})
        }
     },
        {
          text: 'Rojo',
          icon: 'assets/red.svg',
          handler: ()=>{
            this.themeService.enableRed();
            this.storage.setItem('themeColor',{theme:'red-theme'})
        }
    },
        {
          text: 'Celeste',
          icon: 'assets/celeste.svg',
          handler: ()=>{
            this.themeService.enableBlue();
            this.storage.setItem('themeColor',{theme:'blue-theme'})
        }
    },
        {
          text: 'Lila',
          icon: 'assets/purple.svg',
          handler: ()=>{
            this.themeService.enablePurple();
            this.storage.setItem('themeColor',{theme:'purple-theme'})
        }
    },
        {
          text: 'Magenta',
          icon: 'assets/magenta.svg',
          handler: ()=>{
            this.themeService.enableMagenta();
            this.storage.setItem('themeColor',{theme:'magenta-theme'})
        }
    }]
  });
  await actionSheet.present();
  }

  async languageSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona un lenguaje',
      cssClass: 'config-sheet',
      buttons: [{
          text: 'Castellano (por defecto)',
          icon: 'assets/spain.svg',
          handler: ()=>{
           
        }
      },
        {
          text: 'Inglés -No disponible-',
          icon: 'assets/united-states.svg',
          handler: ()=>{
            
        }
    }]
  });
  await actionSheet.present();
  }

  async statsSize(){
    const actionSheet = await this.actionSheetController.create({
      header: '¿Qué top quieres ver en tus estadísticas?',
      cssClass: 'config-sheet',
      buttons: [{
          text: 'Top 20 canciones y artistas',
          handler: ()=>{
          if(this.statsCap != 20){
            this.storage.setItem('topConfig',{value: 20})
            this.statsCap = 20;
            this.clientCredentials.config.stats_cap = 20;
          }
        }
      },
        {
          text: 'Top 50 canciones y artistas',
          handler: ()=>{
          if(this.statsCap != 50){
            this.storage.setItem('topConfig',{value: 50})
            this.statsCap = 50;
            this.clientCredentials.config.stats_cap = 50;
          }
        }
    }]
  });
  await actionSheet.present();
  }

  async acceptConditionsOfTop() {
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: 'Configuración Top',
      message: 'Estás a punto de cambiar cuántas canciones y artistas quieres que te muestre el top, esto afectará al rendimiento de la aplicación, ¿Estás seguro/a?',
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'alertSURE',

        },{
          text: "Entendido",
          role: 'accept',
          cssClass: 'alertOK',
          handler: () =>{
            this.conditionsAccepted = true;
            this.clientCredentials.config.topAlertAccepted = true;
            this.storage.setItem('conditionsAccepted',{isAccepted:'true'})
            this.statsSize();
          }
        }
      ]
    });   
    await alert.present();
  }
}
