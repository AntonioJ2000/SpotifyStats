import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { VirtualTimeScheduler } from 'rxjs';
import { track } from '../model/track';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { LoadingService } from '../services/loading.service';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  skeletonTrack: track = {
    id: '',
    artists: [],
    previewURL: '',
    spotifyURL: '',
    trackName:'',
    trackThumbnail: '',
    playedat: ''
  };
  
  skeletonList: track[] = [
    this.skeletonTrack,
    this.skeletonTrack, 
    this.skeletonTrack, 
    this.skeletonTrack, 
    this.skeletonTrack, 
    this.skeletonTrack, 
    this.skeletonTrack,
    this.skeletonTrack
  ]

  listaCancionesGuardadas: track[] = [];

  offsetVar:number = 0;

  constructor(private spotifyApi:SpotifyApiService,
              private loading:LoadingService) {}

  async ionViewWillEnter(){
    await this.loading.cargarLoading();

    setTimeout(async() => {
      await this.getUserSavedTracks().then(async()=>{
        await this.loading.pararLoading();
      });
    }, 1500); 

  }
  
  ionViewDidLeave(){
    this.listaCancionesGuardadas = [];
    this.offsetVar = 0;
  }
  

  public async getUserSavedTracks(){
    let t = await this.spotifyApi.getCurrentUserSavedTracks(this.offsetVar);

    for(let i=0; i < t.items.length; i++){
      let trackToView:track = {
        id: t.items[i].track.id,
        trackName: t.items[i].track.name,
        spotifyURL: t.items[i].track.external_urls.spotify,
        previewURL: t.items[i].track.preview_url,
        artists: t.items[i].track.artists,
        trackThumbnail: t.items[i].track.album.images[1].url
    
      }
      this.offsetVar++;  
      this.listaCancionesGuardadas.push(trackToView);
      
    }
  }

  public async reloadSavedSongs(){
    this.listaCancionesGuardadas = [];
    this.offsetVar = 0;

    await this.loading.cargarLoading();

    setTimeout(async() => {
      await this.getUserSavedTracks().then(async()=>{
        await this.loading.pararLoading();
      })
    }, 1500);
   
      
  }

  loadData(event) {
    setTimeout(async () => {
        if (this.listaCancionesGuardadas.length == 100) {
          event.target.disabled = true;
        }else{
          await this.getUserSavedTracks().then(()=>{
            event.target.complete();
          });
        }
    }, 1000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }



}
