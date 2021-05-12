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

  /**
   * Returns the client to the normal tabs routing.
   */
  closeSocialPage(){
    this.router.navigate(['/tabs/tab3'])
  }

  /**
   * Function that reloads the social page if any problem was encountered.
   */
  public async reloadSocial(){
    
  }
  
  /**
   * Function that gets all the followed users from the database.
   */
  public async getUsuariosSeguidos(){

  }

  /**
   * Function that gets all the users from the database excepts for the current loged in one.
   */
  public async getUsuarios(){

  }

  /**
   * Function that allows the client to unfollow a user.
   * @param selectedUser The selected user that the client wants to unfollow.
   * @param slot The slot to remove it from the followed user Array.
   */
  public unfollowUser(selectedUser:user, slot:number){
    this.listaUsuarios.push(selectedUser)
    this.listaUsuariosSeguidos.splice(slot, 1);
  }

  /**
   * Function that allows the client to follow a user.
   * @param selectedUser The selected user that the client wants to follow.
   * @param slot The slot to remove it from the non-followed user Array
   */
  public followUser(selectedUser:user, slot:number){
    this.listaUsuariosSeguidos.push(selectedUser);
    this.listaUsuarios.splice(slot, 1)
  }

  /**
   * Function that opens a user profile in the Spotify App.
   * @param selectedUser The selected profile to open.
   */
  public openUserProfileInSpotify(selectedUser:user){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(selectedUser.spotifyURL,'_system', options);
  }

  /**
   * Function that opens a user profile in a modal to show some statistics.
   * @param selectedUser The selected user profile to open.
   */
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

  /**
   * Alert that shows when the unfollow button is pressed.
   * @param selectedUser Selected user to remove.
   * @param slot Slot of the user in the array that the client wants to remove.
   */
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
