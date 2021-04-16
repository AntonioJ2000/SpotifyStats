import { Component } from '@angular/core';
import { track } from '../model/track';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  listaCanciones: track[];

  constructor(private spotifyApi:SpotifyApiService) {}

  ionViewWillEnter(){
    this.getUserSavedTracks();
  }

  public async getUserSavedTracks(){
    let t = await this.spotifyApi.getCurrentUserSavedTracks();

    console.log(t.items);
  }
}
