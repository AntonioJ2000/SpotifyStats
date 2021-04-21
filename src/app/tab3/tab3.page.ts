import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { artist } from '../model/artist';
import { track } from '../model/track';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  listaTopCanciones: track[] = []; 
  listaTopArtistas: artist[] = [];
  listaEscuchadasRecientemente: track[] = [];

  time_range:string='Siempre';

  constructor(private spotifyApi:SpotifyApiService,
              private inAppBrowser: InAppBrowser,
              private loadingController:LoadingController,
              private actionSheetController: ActionSheetController,
              private clientCredentials:ClientcredentialsService) {}

  async ionViewWillEnter(){
    const loading = await this.loadingController.create({
      spinner:null,
      cssClass: 'loading-class',
      message: 'Cargando estadísticas, por favor, espere.'
    })

    await loading.present();
    await this.getUserTopTracks().then(async()=>{
      await this.getUserTopArtists().then(async()=>{
        await this.getUserRecentlyPlayed().then(async()=>{
          await loading.dismiss();
        });
      })
    });
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

    const loading = await this.loadingController.create({
      spinner:null,
      cssClass: 'loading-class',
      message: 'Recargando datos, por favor, espere.'
    })
    await loading.present();
    
    this.listaTopCanciones = [],
    this.listaTopArtistas = [],
    this.listaEscuchadasRecientemente = [],
    
    await this.getUserTopTracks().then(async()=>{
      await this.getUserTopArtists().then(async()=>{
        await this.getUserRecentlyPlayed().then(async()=>{
          await loading.dismiss();
        });
      })
    })

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
        text: 'Ajustar lapso de tiempo',
        icon: 'time-outline',
        handler: ()=>{
          this.timeLapseSheet();
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
