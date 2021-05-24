import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { aux_user_filter } from 'src/app/model/aux_user_filter';
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

  loggedUser:user = this.clientCredentials.user;

  serverError:boolean = false;
  filter:aux_user_filter;

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

  async ngOnInit(){
    await this.addUserToBBDD();
  }            

  async ionViewWillEnter(){
    this.loadingController.cargarLoading();
    try{
    await this.getFollowedUsers().then(async ()=>{
      await this.getUnfowedUsers();
    });
    this.isLoaded = true;
    setTimeout(async() => {
      this.loadingController.pararLoading();      
    }, 300);
    }catch{
        this.serverError = true;
        setTimeout(() => {
        this.loadingController.pararLoading();
      }, 500);
    }
  }

  public async addUserToBBDD(){
      try{
        if(await this.apiUser.getUser(this.loggedUser.id)){
          await this.apiUser.updateUser(this.loggedUser).then(async()=>{
              console.log("He actualizado el usuario");
          });
        }else{
          await this.apiUser.createUser(this.loggedUser);
        }
      }catch{
        console.log("Error en la matrix");
      }
  }

  ionViewWillLeave(){
    this.serverError = false;
  }
  /**
 * Allows user to search a user in the database
 */
public async searchUser(ev:any){
  let val = ev.target.value;
  
  this.filter = {
    id: this.clientCredentials.user.id,
    id_filter: val
  }

  await this.getUsersFiltered(this.filter);
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
    this.isLoaded = false;
    this.loadingController.cargarLoading();
    
    this.listaUsuarios.splice(0, this.listaUsuarios.length);
    this.listaUsuariosSeguidos.splice(0, this.listaUsuariosSeguidos.length);
    
    try{
    await this.getFollowedUsers().then(async()=>{
      await this.getUnfowedUsers().then(()=>{
        this.serverError = false;
        this.isLoaded = true;
        this.loadingController.pararLoading();
      });
    })
      }catch{
        this.serverError = true;
        setTimeout(() => {
          this.loadingController.pararLoading();
        }, 400);   
      }
  }
  
  public isTheUserDeveloper(user:user):boolean{
    if(user.id === "antoniojl69" || user.id === "ciscu6"){
      return true;
    }
    return false;
  }

  /**
   * Function that gets all the followed users from the database.
   */
  public async getFollowedUsers(){
    this.listaUsuariosSeguidos = await this.apiFriend.getFriendsByUser(this.clientCredentials.user.id);
  } 

  /**
   * Function that allows the user to find a friend from the database (if not followed)
   * @param filter Two parameters, *id* of the current client just to make sure he does
   * not appear in the list, and *id_filter*, the text from the input
   */
  public async getUsersFiltered(filter:aux_user_filter){
    this.listaUsuarios = await this.apiUser.getUnfollowedUsersByFilter(filter);
  }

  /**
   * Function that gets all the unfollowed users from the database. (Current not included)
   */
  public async getUnfowedUsers(){
    this.listaUsuarios = await this.apiUser.getAllUnfollowedUsers(this.clientCredentials.user.id);
  }

  /**
   * Function that allows the client to unfollow a user.
   * @param selectedUser The selected user that the client wants to unfollow.
   */
  public async unfollowUser(selectedUser:user){
    let unfriend:friend;
    unfriend = {
      user_primary: this.clientCredentials.user.id,
      user_secondary: selectedUser.id
    }

    await this.apiFriend.deleteByUsersPS(unfriend).then(()=>{
      this.reloadSocial();
    });
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
      this.reloadSocial();
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
  async alertUnfollow(selectedUser:user) {
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: '¿Dejar de seguir?',
      message: 'Estás a punto de dejar de seguir a ' + selectedUser.displayName +', ¿estás seguro/a?',
      buttons: [
        {
          text: "Cancelar",
          role: 'nothing',
          cssClass: 'alertOK',
          handler: () => {
            //Dismissed, no hacemos nada
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
      cssClass: 'myToastv2',
      message: "Ahora sigues a "+selectedUser.displayName,
      duration: 1200,
      position:"bottom"
    });
    toast.present();
  }
}
