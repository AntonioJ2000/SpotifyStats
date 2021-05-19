import { Component, ViewChild } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
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

  errorPresentedSavedTracks: boolean = false;
  cargado:boolean = false;
  emptyList:boolean = false;

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
              private loading:LoadingService,
              private inAppBrowser:InAppBrowser,
              private alertController: AlertController) {}  

  /**
   * Everytime the view is created, gets the saved tracks of the current user, if there are
   * no tracks, appears another view (thats emptyList).
   */
   ionViewDidEnter(){
    if(!this.emptyList){
      this.loading.cargarLoading();
      setTimeout(async() => {
        try{
        await this.getUserSavedTracks().then(()=>{
          if(this.listaCancionesGuardadas.length == 0){
            this.emptyList = true;
          }else{
            this.emptyList = false;
          }
          this.cargado = true;
          setTimeout(async() => {
            this.loading.pararLoading();
          }, 250);
        });
        }catch{
          this.cargado = true;
          this.errorPresentedSavedTracks = true;
          this.loading.pararLoading();
        }
      }, 750); 
    }else{
      this.cargado = true;
    }
  }
  
   /**
   * Removes all items from the list to make the aplication work out fast.
   * offsetVar must be set to 0 due to the successful result of the next requests
   */
  ionViewWillLeave(){
    this.errorPresentedSavedTracks = false;
    this.cargado = false;
    if(this.listaCancionesGuardadas.length != 0){
      this.listaCancionesGuardadas.splice(0, this.listaCancionesGuardadas.length);
    }
    this.offsetVar = 0;
  }
  
  /**
   * Get client saved tracks via HTTP request to the Spotify API
   */
  private async getUserSavedTracks(){
    let t = await this.spotifyApi.getCurrentUserSavedTracks(this.offsetVar);
    let trackToView: track;
    for(let i=0; i < t.items.length; i++){
        trackToView = {
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

  /**
   * Remove all elements from the lists and then reloads them via requests to the Spotify API.
   */
  public async reloadSavedSongs(){
    this.loading.cargarLoading();
    this.errorPresentedSavedTracks = false;
    this.cargado = false;
    this.emptyList = false;

    this.listaCancionesGuardadas.splice(0, this.listaCancionesGuardadas.length);
    this.offsetVar = 0;

    setTimeout(async() => {
      try{
      await this.getUserSavedTracks().then(async()=>{
        setTimeout(() => {
          if(this.listaCancionesGuardadas.length == 0){
            this.emptyList = true;
            this.cargado = true;
          }else{
            this.emptyList = false;
          }
          this.cargado = true;
          this.loading.pararLoading();
        }, 350);
      })
    }catch{
        this.cargado = true;
        this.errorPresentedSavedTracks = true;
        this.loading.pararLoading();
    }
    }, 500);
   
      
  }

  /**
   * Get another 20 saved tracks. It is limited to 100 due to performance issues.
   * @param event ion-infinite element event
   */
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

  /**
   * Disables infinite scroll when the length of the array reaches 100.
   */
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  /**
   * Opens and plays a track in Spotify
   * @param selectedTrack selected track to play and open in Spotify.
   */
  public openSongInSpotify(selectedTrack:track){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    console.log(selectedTrack.spotifyURL)
    this.inAppBrowser.create(selectedTrack.spotifyURL, '_system', options);
  }

  /**
   * If the current user has 0 saved songs, a button appears that allows him to
   * go to his saved tracks in the Spotify App to add some.
   */
  public goToSpotify(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://open.spotify.com/collection/tracks','_system', options);
  }

  /**
   * Alert that helps the user to understand what's the function (or how works) of the Tab2 Page.
   */
  async HelpForSavedTracks() {
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: 'Sobre tus canciones',
      message: 'Estas son las canciones a las que has dado "Me Gusta" en Spotify, ten en cuenta que solo aparecen las 100 primeras.',
      buttons: [
        {
          text: "Entendido",
          role: 'cancel',
          cssClass: 'alertOK'
        }
      ]
    });   
    await alert.present();
  }
}
