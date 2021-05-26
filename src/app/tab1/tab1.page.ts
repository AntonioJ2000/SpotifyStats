import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
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
  errorPresentedTracks:boolean = false;
  errorPresentedArtists:boolean = false;
  errorPresentedRecentlyPlayed:boolean = false;

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

  listaTopCanciones: any[] = []; 
  listaTopArtistas: any[] = [];
  listaEscuchadasRecientemente: any[] = [];

  time_range:string = this.timeRange();

  constructor(private spotifyApi:SpotifyApiService,
              private inAppBrowser: InAppBrowser,
              private actionSheetController: ActionSheetController,
              private clientCredentials:ClientcredentialsService,
              private loading:LoadingService,
              private toastController:ToastController) {}

  /**
  * Get or update the client statistics every time the view is displayed
  */
    async ionViewDidEnter(){
      this.loading.cargarLoading();
        if(this.cargado){
          this.cargado = false;
          this.listaTopCanciones.splice(0, this.listaTopCanciones.length);
          this.listaTopArtistas.splice(0, this.listaTopArtistas.length);
          this.listaEscuchadasRecientemente.splice(0, this.listaEscuchadasRecientemente.length);  
        }

       setTimeout(async() => {
        try{
          await this.getUserTopTracks();
        }catch{
          this.errorPresentedTracks = true;
        }
        
        try{
          await this.getUserTopArtists();
        }catch{
          this.errorPresentedArtists = true;
        }

        try{
          await this.getUserRecentlyPlayed();
        }catch{
          this.errorPresentedRecentlyPlayed = true;
        }

        setTimeout(() => { 
        this.cargado = true;
        this.loading.pararLoading();  
      }, 1250);
    }, 1000);
  }
 
  /**
   * Removes all items from the lists to make the aplication work out fast.
   */
   ionViewDidLeave(){
    this.errorPresentedTracks = false;
    this.errorPresentedArtists = false;
    this.errorPresentedRecentlyPlayed = false;
  }
  
  /**
   * Get client top tracks via HTTP request to the Spotify API
   */
  public async getUserTopTracks(){
    await this.spotifyApi.getCurrentUserTopTracks().then((data)=>{
      this.listaTopCanciones = data.items;
    });
  }

  /**
   * Get client top artists via HTTP request to the Spotify API
   */
  public async getUserTopArtists(){
    await this.spotifyApi.getCurrentUserTopArtists().then((data)=>{
      this.listaTopArtistas = data.items
    });
}

  /**
   * Get client recently played tracks via HTTP request to the Spotify API.
   */
  public async getUserRecentlyPlayed(){
    await this.spotifyApi.getCurrentUserRecentlyPlayed().then((data)=>{
      this.listaEscuchadasRecientemente = data.items
    });
  }

  /**
   * Remove all elements from the lists and then reloads them via requests to the Spotify API.
   */
  public async reloadStats(){
    this.errorPresentedTracks = false;
    this.errorPresentedArtists = false;
    this.errorPresentedRecentlyPlayed = false;
    this.cargado = false;
    this.loading.cargarLoading();

    this.listaTopCanciones.splice(0, this.listaTopCanciones.length);
    this.listaTopArtistas.splice(0, this.listaTopArtistas.length);
    this.listaEscuchadasRecientemente.splice(0, this.listaEscuchadasRecientemente.length);
    
      try{
        await this.getUserTopTracks();
      }catch{
        this.errorPresentedTracks = true;
      }
      
      try{
        await this.getUserTopArtists();
      }catch{
        this.errorPresentedArtists = true;
      }

      try{
        await this.getUserRecentlyPlayed();
      }catch{
        this.errorPresentedRecentlyPlayed = true;
      }

      setTimeout(async() => {
       this.cargado = true;
       this.loading.pararLoading();  
      }, 1000); 
    
  }

  /**
   * Opens a selected artist profile in the Spotify App, if not installed, opens it with a browser.
   * @param selectedArtist artist to open. 
   */
  public openArtistProfile(selectedArtist:any){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create(selectedArtist.external_urls.spotify, '_system', options);
  }

  /**
   * Opens and plays a track in Spotify
   * @param selectedTrack selected track to play and open in Spotify.
   */
  public openTrackInSpotify(selectedTrack:any){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create(selectedTrack.external_urls.spotify, '_system', options);
  }

  /**
   * Opens and plays a track in Spotify
   * @param selectedTrack selected track to play and open in Spotify.
   */
  public openRecentlyTrackInSpotify(selectedRecentlyTrack:any){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create(selectedRecentlyTrack.track.external_urls.spotify, '_system', options);
  }

  /**
   * Puts dots every 3 numbers starting from the end.
   * @param x Number to put the dots in.
   * @returns String with the new number
   */
  public numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  public timeRange():string{
    if(this.clientCredentials.config.time_range = 'short_term'){
      return '4 sem.'
    }else if(this.clientCredentials.config.time_range = 'medium_term'){
      return '6 meses'
    }else if(this.clientCredentials.config.time_range = 'long_term'){
      return 'Siempre'
    }

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
      msg = "¡Este artista es muy popular!"
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
