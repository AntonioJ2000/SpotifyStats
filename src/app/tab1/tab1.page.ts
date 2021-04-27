import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import { artist } from '../model/artist';
import { track } from '../model/track';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { LoadingService } from '../services/loading.service';
import { SpotifyApiService } from '../services/spotify-api.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {


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

  listaTopCanciones: track[] = []; 
  listaTopArtistas: artist[] = [];
  listaEscuchadasRecientemente: track[] = [];

  time_range:string='Siempre';

  constructor(private spotifyApi:SpotifyApiService,
              private inAppBrowser: InAppBrowser,
              private actionSheetController: ActionSheetController,
              private clientCredentials:ClientcredentialsService,
              private loading:LoadingService) {}

  async ionViewDidEnter(){
    await this.loading.cargarLoading();

    setTimeout(async() => {
      await this.getUserTopTracks().then(async()=>{
        await this.getUserTopArtists().then(async()=>{
          await this.getUserRecentlyPlayed().then(async()=>{
            setTimeout(async () => {
              await this.loading.pararLoading();
            }, 750); 
          });
        })
      });
    }, 2000);  
  }
 
  async ionViewDidLeave(){
    this.listaTopCanciones = [];
    this.listaTopArtistas = [];
    this.listaEscuchadasRecientemente = [];
  }
  
  public async getUserTopTracks(){
    let t = await this.spotifyApi.getCurrentUserTopTracks();
    
    for(let i=0; i < t.items.length; i++){
      let trackToView:track = {
        id: t.items[i].id,
        trackName: t.items[i].name,
        spotifyURL: t.items[i].external_urls.spotify,
        previewURL: t.items[i].preview_url,
        artists: t.items[i].artists,
        trackThumbnail: t.items[i].album.images[1].url
      }  
      this.listaTopCanciones.push(trackToView);
    }
  }

  public async getUserTopArtists(){
    let t = await this.spotifyApi.getCurrentUserTopArtists();

    for(let i=0; i < t.items.length; i++){
      let artistToView:artist = {
        image: t.items[i].images[1].url,
        name: t.items[i].name,
        popularity: t.items[i].popularity,
        spotifyURL: t.items[i].external_urls.spotify,
        followers: t.items[i].followers.total
      }
      this.listaTopArtistas.push(artistToView);
    }
  }

  public async getUserRecentlyPlayed(){
    let t = await this.spotifyApi.getCurrentUserRecentlyPlayed();

    for(let i=0; i < t.items.length; i++){
      let trackToView:track = {
        id: t.items[i].track.id,
        trackName: t.items[i].track.name,
        spotifyURL: t.items[i].track.external_urls.spotify,
        previewURL: t.items[i].track.preview_url,
        artists: t.items[i].track.artists,
        trackThumbnail: t.items[i].track.album.images[1].url,
        playedat: t.items[i].played_at
      }
      
      this.listaEscuchadasRecientemente.push(trackToView);
    }
  }

  public async reloadStats(){
    this.listaTopCanciones = [];
    this.listaTopArtistas = [];
    this.listaEscuchadasRecientemente = [];

    await this.loading.cargarLoading();

    
    setTimeout(async() => {
      await this.getUserTopTracks().then(async()=>{
        await this.getUserTopArtists().then(async()=>{
          await this.getUserRecentlyPlayed().then(async()=>{
            setTimeout(async() => {
              await this.loading.pararLoading();  
            }, 500);
          });
        })
      })
    }, 1250);
  }


  public openArtistProfile(selectedArtist:artist){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(selectedArtist.spotifyURL, '_system', options);
  }

  async presentActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione una opción',
      cssClass: 'config-sheet',
      buttons: [{
        text: 'Este botón no hace nada',
        icon: 'assets/spotify.svg',
        handler: ()=>{
          console.log('No hay nada')
        }
      }]
    });
    await actionSheet.present();
  }

  async timeLapseSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Lapso de tiempo',
      cssClass: 'config-sheet',
      buttons: [{
          text: 'Desde que se creó la cuenta',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            this.clientCredentials.config.time_range = 'long_term';
            this.reloadStats();
            this.time_range = 'Siempre'
        }
      },
        {
          text: 'Los últimos 6 meses',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            this.clientCredentials.config.time_range = 'medium_term';
            this.reloadStats();
            this.time_range = '6 Meses'
        }
      },
        {
          text: 'Las útimas 4 semanas',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            this.clientCredentials.config.time_range = 'short_term';
            this.reloadStats();
            this.time_range = '4 Sem.'
        }
      }]
  });
  await actionSheet.present();
  }
  
}
