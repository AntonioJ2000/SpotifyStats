import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { track } from '../model/track';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  listaCancionesGuardadas: track[] = [];
  listaCancionesGuardadasReturned: track[] = [];
  firtTime: boolean = true;
  offsetVar:number = 0;

  constructor(private spotifyApi:SpotifyApiService,
              private loadingController:LoadingController,
              private clientCredentials:ClientcredentialsService) {}

  async ngOnInit(){
    const loading = await this.loadingController.create({
      spinner:null,
      cssClass: 'loading-class',
      message: 'Cargando tus canciones, por favor, espere.'
    })

    await loading.present();

    await this.getUserSavedTracks().then(async()=>{
      await loading.dismiss();
      this.listaCancionesGuardadasReturned = this.listaCancionesGuardadas;
    });

    this.firtTime = false;

  }
  
  async ionViewWillEnter(){
    if(!this.firtTime){
      const loading = await this.loadingController.create({
        spinner:null,
        cssClass: 'loading-class',
        message: 'Cargando'
      })
      await loading.present();
  
      await (this.listaCancionesGuardadas = this.listaCancionesGuardadasReturned);
  
      await loading.dismiss();
    }
  }

  ionViewDidLeave(){
    this.listaCancionesGuardadas = [];
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

  loadData(event) {
    setTimeout(async () => {
        if (this.listaCancionesGuardadas.length == 120) {
          event.target.disabled = true;
        }else{
          await this.getUserSavedTracks().then(()=>{
            event.target.complete();
          });
        }
          this.listaCancionesGuardadasReturned = this.listaCancionesGuardadas;
    }, 1000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
