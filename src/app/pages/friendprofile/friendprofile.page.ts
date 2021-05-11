import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { user } from 'src/app/model/user';

@Component({
  selector: 'app-friendprofile',
  templateUrl: './friendprofile.page.html',
  styleUrls: ['./friendprofile.page.scss'],
})
export class FriendprofilePage {

  @Input('selectedUser') selectedUser:user;

  constructor(private modalController:ModalController,
              private inAppBrowser:InAppBrowser) { }

  ionViewWillEnter(){
    console.log(this.selectedUser)
  }

  closeFriendProfilePage(){
    this.modalController.dismiss();
  }

  openFriendSpotifyProfile(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no', 
    }
    const browser = this.inAppBrowser.create(this.selectedUser.spotifyURL, '_system', options)
  
  }

}
