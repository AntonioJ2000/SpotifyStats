import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { artist } from 'src/app/model/artist';
import { track } from 'src/app/model/track';
import { user } from 'src/app/model/user';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';

@Component({
  selector: 'app-friendprofile',
  templateUrl: './friendprofile.page.html',
  styleUrls: ['./friendprofile.page.scss'],
})
export class FriendprofilePage {

  @Input('selectedUser') selectedUser:user;

  constructor(private modalController:ModalController,
              private inAppBrowser:InAppBrowser,
              private clientCredentials:ClientcredentialsService) { }

  ionViewWillEnter(){   
    
  }

  closeFriendProfilePage(){
    this.modalController.dismiss();
  }

  /**
   * Opens the selected friend Spotify Profile in the Spotify App, if not installed, normal browser opens it instead.
   */
  openFriendSpotifyProfile(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no', 
    }
    const browser = this.inAppBrowser.create(this.selectedUser.spotifyURL, '_system', options)
  }

  public openSongOrArtistInSpotify(selectedItem:track | artist){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    console.log(selectedItem.spotifyURL)
    this.inAppBrowser.create(selectedItem.spotifyURL, '_system', options);
  }

}
