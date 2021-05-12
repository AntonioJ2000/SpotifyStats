import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { artist } from '../model/artist';
import { track } from '../model/track';
import { user } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class ClientcredentialsService {

  exampleTrack:track;
  exampleArtist:artist;

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
    id:"hola",
    image:'assets/no_profile_image.jpg',
    artists: [],
    tracks: []
  }

  /**
   * Default value for the HTTP requests.
   */
  config = {
    time_range: 'long_term'
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
