import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { user } from 'src/app/model/user';
import { FriendprofilePage } from '../friendprofile/friendprofile.page';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage {

  listaUsuarios:user[] = [];
  listaUsuariosSeguidos:user[] = [];

  constructor(public modalController: ModalController,
              public inAppBrowser:InAppBrowser,
              private router:Router,
              private alertController:AlertController) { }

  ionViewWillEnter(){
    let exampleUser:user = {
      id: 'antoniojl11',
      displayName: 'Antonio11',
      followers: 19,
      image: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
      spotifyURL: 'https://google.es'
    }
    this.listaUsuarios.push(exampleUser);
  }

  closeSocialPage(){
    this.router.navigate(['/tabs/tab3'])
  }

  public async reloadSocial(){
    
  }

  public async getUsuariosSeguidos(){

  }

  public async getUsuarios(){

  }

  public unfollowUser(selectedUser:user, slot:number){
    this.listaUsuarios.push(selectedUser)
    this.listaUsuariosSeguidos.splice(slot, 1);
  }

  public followUser(selectedUser:user, slot:number){
    this.listaUsuariosSeguidos.push(selectedUser);
    this.listaUsuarios.splice(slot, 1)
  }

  public openUserProfileInSpotify(selectedUser:user){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(selectedUser.spotifyURL,'_system', options);
  }

  public async openUserProfile(selectedUser:user){
    const modal = await this.modalController.create({
      component: FriendprofilePage,
      cssClass: 'my-custom-class',
      componentProps:{
        selectedUser:selectedUser
      }
    });
    modal.present();
  }

  async alertUnfollow(selectedUser:user, slot:number) {
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: '¿Dejar de seguir?',
      message: 'Estás a punto de dejar de seguir a este usuario, ¿estás seguro/a?',
      buttons: [
        {
          text: "Cancelar",
          role: 'nothing',
          cssClass: 'alertOK',
          handler: () => {
            //Dismissed
          }
        },{
          text: "Aceptar",
          role: 'unfollow',
          cssClass: 'alertDELETE',
          handler: () => {
            this.unfollowUser(selectedUser, slot);
          }
        }
      ]
    });
      
    await alert.present();
  }

}
