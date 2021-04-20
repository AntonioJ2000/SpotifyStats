import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { track } from '../model/track';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  listaCancionesGuardadas: track[] = [];
  offsetVar:number = 0;

  constructor(private spotifyApi:SpotifyApiService) {}

  ionViewWillEnter(){
    this.getUserSavedTracks();
  }

  
  ionViewDidLeave(){
    this.listaCancionesGuardadas = [];
    this.offsetVar = 0;
  }
  

  public async getUserSavedTracks(){
    let t = await this.spotifyApi.getCurrentUserSavedTracks(this.offsetVar);
    let songList:any[] = t.items;

    for(let i=0; i < songList.length; i++){
      let trackToView:track = {
        id: songList[i].track.id,
        trackName: songList[i].track.name,
        spotifyURL: songList[i].track.external_urls.spotify,
        previewURL: songList[i].track.preview_url,
        artists: songList[i].track.artists,
        trackThumbnail: songList[i].track.album.images[1].url
    
      }
      this.offsetVar++;  
      this.listaCancionesGuardadas.push(trackToView);
      
    }
  }

  loadData(event) {
    setTimeout(async () => {
      console.log('Done');
        await this.getUserSavedTracks();
  
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.listaCancionesGuardadas.length == 1000) {
        event.target.disabled = true;
      }
    }, 1000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
