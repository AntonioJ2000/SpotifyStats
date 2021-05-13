import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { friend } from 'src/app/model/friend';
import { user } from 'src/app/model/user';
import { ApiFriendService } from 'src/app/services/api-friend.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FriendprofilePage } from '../friendprofile/friendprofile.page';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage {

  listaUsuarios:user[] = [];
  listaUsuariosSeguidos:user[] = [];

  isLoaded:boolean;

  constructor(public modalController: ModalController,
              public inAppBrowser:InAppBrowser,
              private router:Router,
              private alertController:AlertController,
              private apiUser:ApiUserService,
              private apiFriend:ApiFriendService,
              private clientCredentials:ClientcredentialsService,
              private toastController: ToastController,
              private loadingController: LoadingService) { }

  async ionViewWillEnter(){
    this.loadingController.cargarLoading();
    await this.getFollowedUsers().then(async ()=>{
      let t = await this.apiUser.getUsersWithoutCurrentClient(this.clientCredentials.user.id);

        let userToView:user;
        for(let i=0; i < t.length; i++){
            userToView = {
              id: t[i].id,
              displayName: t[i].displayName,
              image: t[i].image,
              followers: t[i].followers,
              spotifyURL: t[i].spotifyURL,
              artists: t[i].artists,
              tracks: t[i].tracks
            }
        this.listaUsuarios.push(userToView);
      }
    });

    this.isLoaded = true;
    setTimeout(async() => {
      this.loadingController.pararLoading();      
    }, 300);

    /** 
    let exampleUser:user = {
      id: 'antoniojl11',
      displayName: 'Antonio11',
      followers: 19,
      image: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
      spotifyURL: 'https://google.es'
    }
    this.listaUsuarios.push(exampleUser);
    */
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
  public async getFollowedUsers(){
    this.listaUsuariosSeguidos = await this.apiFriend.getFriendsByUser(this.clientCredentials.user.id);
    
    
  } 

  /**
   * Function that gets all the users from the database excepts for the current loged in one and unfollowed.
   */
  public async getUnfollowedUsers(){

  }

  /**
   * Function that allows the client to unfollow a user.
   * @param selectedUser The selected user that the client wants to unfollow.
   */
  public unfollowUser(selectedUser:user){
    

  }

  /**
   * Function that allows the client to follow a user.
   * @param selectedUser The selected user that the client wants to follow.
   */
  public async followUser(selectedUser:user){
    let friend:friend;
    friend = {
      user_primary: this.clientCredentials.user.id,
      user_secondary: selectedUser.id
    }
    await this.apiFriend.createFriend(friend).then(()=>{
      this.followedUserToast(selectedUser);
    });
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
      },
      
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
            this.unfollowUser(selectedUser);
          }
        }
      ]
    });
      
    await alert.present();
  }

  public async followedUserToast(selectedUser:user){
    const toast = await this.toastController.create({
      cssClass: 'myToast',
      message: "Ahora sigues a "+selectedUser.displayName,
      duration: 1200,
      position:"bottom"
    });
    toast.present();
  }
}
