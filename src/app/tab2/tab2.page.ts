import { Component, ViewChild } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { artist } from '../model/artist';
import { track } from '../model/track';
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
  firtTime:boolean = false;


  constructor(private spotifyApi:SpotifyApiService,
              private loading:LoadingService,
              private inAppBrowser:InAppBrowser) {}

  async ionViewWillEnter(){
    if(!this.firtTime){
      await this.loading.cargarLoading();
      this.firtTime = false;
    }
    
      await this.getUserSavedTracks().then(async()=>{
        setTimeout(async() => {
          await this.loading.pararLoading();
        }, 750);
        
      });

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
    }, 500);
   
      
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

  public openSongInSpotify(selectedTrack:track){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(selectedTrack.spotifyURL, '_system', options);
  }


}
