import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage {

  constructor(private router:Router,
              private alertController:AlertController,
              private actionSheetController:ActionSheetController) { }

  closeConfigPage(){
    this.router.navigate(['/tabs/tab3'])
  }

  deleteUserSocialProfile(){

  }

  async alertConfirmDeleteSocialProfile(){
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: 'Borrar perfil',
      message:'¿Estás seguro/a de que deseas eliminar tu perfil de Social?, podrás recuperarlo en el futuro.',
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
            this.deleteUserSocialProfile();
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
          icon: 'chevron-forward-outline',
          handler: ()=>{
           
        }
      },
        {
          text: 'Blanco',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            
        }
      },
        {
          text: 'Naranja',
          icon: 'chevron-forward-outline',
          handler: ()=>{
           

        }
      },
        {
          text: 'Rojo',
          icon: 'chevron-forward-outline',
          handler: ()=>{
         

        }
     },
        {
          text: 'Amarillo',
          icon: 'chevron-forward-outline',
          handler: ()=>{
        

        }
    },
        {
          text: 'Azul',
          icon: 'chevron-forward-outline',
          handler: ()=>{
        

        }
    },
        {
          text: 'Morado',
          icon: 'chevron-forward-outline',
          handler: ()=>{
        

        }
    },
        {
          text: 'Magenta',
          icon: 'chevron-forward-outline',
          handler: ()=>{
        

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
          text: 'Inglés',
          icon: 'assets/united-states.svg',
          handler: ()=>{
            
        }
    }]
  });
  await actionSheet.present();
  }

}
