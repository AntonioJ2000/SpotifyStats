import { Injectable } from '@angular/core';
import { artist } from '../model/artist';
import { track } from '../model/track';

@Injectable({
  providedIn: 'root'
})
export class ClientcredentialsService {

  client = {
    access_token: '',
  }

  user = {
    display_name: '',
    external_urls: '',
    followers: 0,
    id:0,
    image:'',
    type:''
  }

  config = {
    time_range: 'long_term'
  }


  constructor() { }

  forgetToken(){
    this.client.access_token = '';
  }
}
