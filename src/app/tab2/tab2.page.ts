import { Component } from '@angular/core';
import { track } from '../model/track';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  listaCanciones: Array<track>;

  constructor(private spotifyApi:SpotifyApiService) {}

  ionViewWillEnter(){
    this.getUserSavedTracks();
  }

  public async getUserSavedTracks(){
    let t = await this.spotifyApi.getCurrentUserSavedTracks();
    let songList:any[] = t.items;

    for(let i=0; i < songList.length; i++){
      let trackToView:track = {
        id: songList[i].track.id,
        trackName: songList[i].track.name,
        spotifyURL: songList[i].track.external_urls.spotify,
        previewURL: songList[i].track.preview_url,
        artists: songList[i].track.artists,
        trackThumbnail: songList[i].track.album.images[0]
      }  
      this.listaCanciones.push(trackToView);
      
    }
 
      console.log(this.listaCanciones);
  }
}
