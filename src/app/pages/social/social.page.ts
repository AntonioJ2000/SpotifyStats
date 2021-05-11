import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
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
              private router:Router) { }

  ionViewWillEnter(){
    let exampleUser:user = {
      id: 'antoniojl11',
      displayName: 'Antonio11',
      followers: 19,
      image: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
      spotifyURL: 'https://google.es'
    }

    this.listaUsuarios.push(exampleUser);
    this.listaUsuariosSeguidos.push(exampleUser);
  }

  closeSocialPage(){
    this.router.navigate(['/tabs/tab3'])
  }

  reloadSocial(){
    
  }

  public async getUsuariosSeguidos(){

  }

  public async getUsuarios(){

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

}
