import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
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
  user = {
    display_name: '',
    external_urls: '',
    followers: 0,
    id:0,
    image:'assets/no_profile_image.jpg',
    type:''
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
