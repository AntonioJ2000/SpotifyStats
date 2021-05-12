import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
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

  cargado:boolean = false;

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
              private loading:LoadingService,
              private toastController:ToastController) {}

  
  /**
  * Get or update the client statistics every time the view is displayed
  */
  ionViewDidEnter(){
    this.loading.cargarLoading();

  setTimeout(async() => {
    await this.getUserTopTracks().then(async()=>{
      await this.getUserTopArtists().then(async()=>{
        await this.getUserRecentlyPlayed().then(()=>{
          this.cargado = true;
          setTimeout(() => {
            this.loading.pararLoading();  
          }, 650); 
        });
      })
    });
  }, 1500);  
}
 
  /**
   * Removes all items from the lists to make the aplication work out fast.
   */
  async ionViewWillLeave(){
    if(this.listaTopCanciones.length != 0 && this.listaTopArtistas.length != 0 && this.listaEscuchadasRecientemente.length != 0){
      this.cargado = false;
      this.listaTopCanciones.splice(0, this.listaTopCanciones.length);
      this.listaTopArtistas.splice(0, this.listaTopArtistas.length);
      this.listaEscuchadasRecientemente.splice(0, this.listaEscuchadasRecientemente.length);
  
    }
  }
  
  /**
   * Get client top tracks via HTTP request to the Spotify API
   */
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

  /**
   * Get client top artists via HTTP request to the Spotify API
   */
  public async getUserTopArtists(){
    let t = await this.spotifyApi.getCurrentUserTopArtists();

    for(let i=0; i < t.items.length; i++){
      let artistToView:artist = {
        image: t.items[i].images[2].url,
        name: t.items[i].name,
        popularity: t.items[i].popularity,
        spotifyURL: t.items[i].external_urls.spotify,
        followers: t.items[i].followers.total
      }
      this.listaTopArtistas.push(artistToView);
    }
  }

  /**
   * Get client recently played tracks via HTTP request to the Spotify API.
   */
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

  /**
   * Remove all elements from the lists and then reloads them via requests to the Spotify API.
   */
  public async reloadStats(){
    this.cargado = false;
    this.loading.cargarLoading();

    this.listaTopCanciones.splice(0, this.listaTopCanciones.length);
    this.listaTopArtistas.splice(0, this.listaTopArtistas.length);
    this.listaEscuchadasRecientemente.splice(0, this.listaEscuchadasRecientemente.length);

    
    setTimeout(async() => {
      await this.getUserTopTracks().then(async()=>{
        await this.getUserTopArtists().then(async()=>{
          await this.getUserRecentlyPlayed().then(()=>{
            setTimeout(() => {
              this.loading.pararLoading(); 
              this.cargado = true;
            }, 500);
          });
        })
      })
    }, 1250);
  }

  /**
   * Opens a selected artist profile in the Spotify App, if not installed, opens it with a browser.
   * @param selectedArtist artist to open. 
   */
  public openArtistProfile(selectedArtist:artist){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create(selectedArtist.spotifyURL, '_system', options);
  }

  /**
   * Allows the client to change the time lapse of his statistics between 4 weeks, 6 months and since 
   * the creation of the account.
   */
  async timeLapseSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Lapso de tiempo',
      cssClass: 'config-sheet',
      buttons: [{
          text: 'Desde que se creó la cuenta',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            if(this.clientCredentials.config.time_range != 'long_term'){
              this.clientCredentials.config.time_range = 'long_term';
              this.reloadStats();
              this.time_range = 'Siempre'
            }
        }
      },
        {
          text: 'Los últimos 6 meses',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            if(this.clientCredentials.config.time_range != 'medium_term'){
              this.clientCredentials.config.time_range = 'medium_term';
              this.reloadStats();
              this.time_range = '6 Meses'
            }
        }
      },
        {
          text: 'Las útimas 4 semanas',
          icon: 'chevron-forward-outline',
          handler: ()=>{
            if(this.clientCredentials.config.time_range != 'short_term'){
              this.clientCredentials.config.time_range = 'short_term';
              this.reloadStats();
              this.time_range = '4 Sem.'
            }
        }
      }]
  });
  await actionSheet.present();
  }
  
  /**
   * Shows a toast with the meaning of the icons
   * @param tN slot of the icon pressed
   */
  async presentToast(tN:number) {
    let msg:string = '';

    if(tN == 1){
      msg = "Este es tu artista más escuchado en el lapso de tiempo indicado."
    }else if(tN == 2){
      msg = "¡Este artista es muy popular! (+80)"
    }else if(tN == 3){
      msg = "Este artista ha superado el millón de seguidores."
    }

    const toast = await this.toastController.create({
      cssClass: 'myToast',
      message: msg,
      duration: 1500,
      position:"bottom"
    });
    toast.present();
  }
  
}
