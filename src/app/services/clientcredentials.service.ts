import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { artist } from '../model/artist';
import { track } from '../model/track';
import { user } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class ClientcredentialsService {


  /**
   * Used just to work with both tokens in the entire App.
   */
  client = {
    access_token: '',
    refresh_token: ''
  }

  /**
   * Used to save the registered client basic info for the Profile Page (Tab 3).
   */
  user:user = {
    displayName: '',
    spotifyURL: '',
    followers: 0,
    id:'',
    image:'assets/no_profile_image.jpg',
    artists: [],
    tracks: []
  }

  /**
   * Config adjusted by the client.
   */
  config = {
    time_range: 'long_term',
    stats_cap: 20,
    topAlertAccepted: false,
    profileVisible: true,
    developerAccount: false
  }


  constructor(private storage:NativeStorage) { }

  /**
   * Function that removes the saved tokens information and the native storage's one.
   */
  forgetToken(){
    this.client.access_token = '';
    this.client.refresh_token = '';

    this.storage.remove('refreshToken');
  }
}
