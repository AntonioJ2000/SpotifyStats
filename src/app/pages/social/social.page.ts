import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { user } from 'src/app/model/user';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage {

  listaUsuarios:user[] = [];
  listaUsuariosSeguidos:user[] = [];

  constructor(public modalController: ModalController,
              public inAppBrowser:InAppBrowser) { }

  closeSocialPage(){
    this.modalController.dismiss();
  }

  reloadSocial(){
    
  }

  public async getUsuariosSeguidos(){

  }

  public async getUsuarios(){

  }

  public openUserProfile(selectedUser:user){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(selectedUser.spotifyURL,'_system', options);
  }

}
