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

   ionViewDidEnter(){
    if(!this.emptyList){
      this.loading.cargarLoading();
      setTimeout(async() => {
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
      }, 750); 
    }else{
      this.cargado = true;
    }
  }
  
  ionViewWillLeave(){
    this.cargado = false;
    if(this.listaCancionesGuardadas.length != 0){
      this.listaCancionesGuardadas.splice(0, this.listaCancionesGuardadas.length);
    }
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
    this.loading.cargarLoading();
    this.cargado = false;
    this.emptyList = false;

    this.listaCancionesGuardadas.splice(0, this.listaCancionesGuardadas.length);
    this.offsetVar = 0;

    setTimeout(async() => {
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
    console.log(selectedTrack.spotifyURL)
    const browser = this.inAppBrowser.create(selectedTrack.spotifyURL, '_system', options);
  }

  public goToSpotify(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create('https://open.spotify.com/collection/tracks','_system', options);
  }

  async HelpForSavedTracks() {
    const alert = await this.alertController.create({
      cssClass: 'myAlert',
      header: 'Sobre tus canciones',
      message: 'Estas son las canciones a las que has dado "Me Gusta" en Spotify, ten en cuenta que solo aparecen las 100 primeras.',
      buttons: [
        {
          text: "Entendido",
          role: 'cancel',
          cssClass: 'alertOK',
          handler: () => {

          }
        }
      ]
    });
      
    await alert.present();
  }
}
