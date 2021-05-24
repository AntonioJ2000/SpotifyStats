import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { issue } from 'src/app/model/issue';
import { ApiIssueService } from 'src/app/services/api-issue.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage {
  public tasks:FormGroup;

  toggleChecked:boolean = this.clientCredentials.config.profileVisible;
  statsCap:number = this.clientCredentials.config.stats_cap;
  conditionsAccepted:boolean = this.clientCredentials.config.topAlertAccepted;

  constructor(private alertController:AlertController,
              private actionSheetController:ActionSheetController,
              private themeService:ThemeService,
              private storage:NativeStorage,
              private clientCredentials:ClientcredentialsService,
              private loading:LoadingService,
              private apiUser:ApiUserService,
              private navCtrl:NavController,
              private formBuilder:FormBuilder,
              private apiIssue:ApiIssueService,
              private toastController: ToastController,
              private authS:AuthService)
              {  

       this.tasks=this.formBuilder.group({
          issueTitle:['', Validators.required],
          issueDescription:['', Validators.required]
       })         
  }

  /**
   * Closes the config page.
   */
  closeConfigPage(){
    this.navCtrl.navigateRoot(['/tabs/tab3'])
  }

  /**
   * Function that deletes the user created account for social and logs out from the app.
   */
  async deleteUserAccount(){
    this.loading.cargarLoading();

    try{
      await this.apiUser.removeUser(this.clientCredentials.user.id).then(()=>{
        this.authS.logout();
        setTimeout(() => {
          this.loading.pararLoading();
        }, 500);
      });
    }catch{
      console.log("No se ha podido eliminar el usuario");
      setTimeout(() => {
        this.removeClientToast();
        this.loading.pararLoading();
      }, 500);
    }

  }

  /**
   * Function that deletes the current user profile from the social side of the app making it
   * unavailable until the toggle button is active
   */
  async makeUserProfileVisibleSocial(){
    this.loading.cargarLoading();
    setTimeout(async() => {
    this.toggleChecked = !this.toggleChecked;
    this.clientCredentials.config.profileVisible = !this.clientCredentials.config.profileVisible;
    
    try{
      if(this.toggleChecked){ 
        if(await this.apiUser.getUser(this.clientCredentials.user.id)) {
          await this.apiUser.updateUser(this.clientCredentials.user).then(()=>{
            this.storage.setItem('visibleProfile',{isVisible: true})
            this.loading.pararLoading();
          });
        } 
      }
      }catch{
            try{
              await this.apiUser.createUser(this.clientCredentials.user);
            }catch{
              this.loading.pararLoading();   
            }
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
      this.loading.pararLoading();
      console.log('El usuario no existe')
    }
    }, 1000);
  }

  async sendReport(){
    this.loading.cargarLoading();

    let issueToDb:issue = {
      id_user: this.clientCredentials.user.id,
      issue: this.tasks.get('issueTitle').value,
      description: this.tasks.get('issueDescription').value
    }

    try{
      await this.apiIssue.createIssue(issueToDb).then(()=>{
        this.issueSent(true);
        this.tasks.setValue({issueTitle: '', issueDescription: ''});
        this.loading.pararLoading();
      });
    }catch{
      this.issueSent(false);
      this.loading.pararLoading();
    }
    
  }

  /**
   * Shows an alert that must be accepted in order to delete the current user account
   */
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

  /**
   * Shows a menu with the different themes that the current user can pick.
   */
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

  /**
   * Shows a menu with the different languages that the current user can pick.
   */
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

  /**
   * Shows a menu with the different config that the current user can pick, alert must be accepted.
   */
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

  /**
   * Alert that the user should accept in order to modify the configuration
   */
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

  async issueSent(success:boolean) {
    let cssCl;
    let msg;
    if(success){
      cssCl = 'myToast'
      msg = "El reporte ha sido enviado correctamente.";
    }else if(!success){
      cssCl = 'myToastErrorBottom'
      msg = "Error al enviar el reporte, inténtalo más tarde o comprueba tu conexión a Internet."
    }

    const toast = await this.toastController.create({
      cssClass: cssCl,
      message: msg,
      duration: 1500,
      position:"bottom"
    });
    toast.present();
  }

  async removeClientToast(){
    const toast = await this.toastController.create({
      cssClass: 'myToastErrorBottom',
      message: 'Error al eliminar tu cuenta, por favor inténtalo de nuevo más tarde.',
      duration: 2000,
      position:"bottom"
    });
    toast.present();
  }
}
