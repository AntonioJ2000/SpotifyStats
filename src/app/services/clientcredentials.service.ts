import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientcredentialsService {

  client = {
    access_token: '',
    expires_in: 0,
    encrypted_refresh_token: ''
  }

  user = {
    display_name: '',
    external_urls: '',
    followers: 0,
    id:'',
    image:'',
    type:''
  }

  constructor() { }
}
