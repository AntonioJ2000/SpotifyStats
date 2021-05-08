import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { artist } from '../model/artist';
import { track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class ClientcredentialsService {

  client = {
    access_token: '',
    refresh_token: ''
  }

  user = {
    display_name: '',
    external_urls: '',
    followers: 0,
    id:0,
    image:'assets/no_profile_image.jpg',
    type:''
  }

  config = {
    time_range: 'long_term'
  }


  constructor(private storage:NativeStorage) { }

  forgetToken(){
    this.client.access_token = '';
    this.client.refresh_token = '';

    this.storage.remove('refreshToken');
  }
}
