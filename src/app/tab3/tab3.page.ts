import { Component } from '@angular/core';
import { MediaObject } from '@ionic-native/media/ngx';
import { NavController, PopoverController } from '@ionic/angular';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { track } from '../model/track';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { artist } from '../model/artist';
import { ProfilepopoverComponent } from '../components/profilepopover/profilepopover.component';
import { user } from '../model/user';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

  visibleSocialButton:boolean = this.clientCredentials.config.profileVisible;
  errorProfile:boolean = false;

  specialInfoError = false;

  isDeveloperAccount:boolean = false;

  firstTime:boolean = false;
  specialInfoLoaded:boolean = false;
  loggedUser:user = this.clientCredentials.user;
  favouriteSong:track = {
    artists: [],
    id: '',
    previewURL: '',
    spotifyURL: '',
    trackName: 'N/A',
    trackThumbnail: 'assets/vinyl_record.png'
  };

  favouriteArtist:artist = {
    followers: 0,
    image: 'assets/no_profile_image.jpg',
    name: 'N/A',
    popularity: 0,
    spotifyURL: ''
  };
  
  status:string = "";
  audioFile:MediaObject;

  constructor(
    public navCtrl:NavController,
    private loading:LoadingService,
    private clientCredentials:ClientcredentialsService,
    private spotifyApi:SpotifyApiService,
    private authService:AuthService,
    private inAppBrowser:InAppBrowser,
    public popoverController: PopoverController) {}

    /**
     * If its the first time the user enters the view, load al his profile obtined via requests.
    */
  async ionViewDidEnter(){
      if(!this.firstTime){
        this.loading.cargarLoadingOscuro();

      try{
      await this.getUserFavourite3Songs().then(()=>{
        if(this.favouriteSong.id == ''){
          this.specialInfoError = true;
        }
      });
      await this.getUserFavourite3Artists().then(()=>{
        if(this.favouriteArtist.id == ''){
          this.specialInfoError = true;
        }  
      });    
                  
      await this.getUserProfile().then(()=>{
        this.loading.pararLoading();
      });
    }catch{
        this.errorProfile = true;
        setTimeout(() => {
          this.loading.pararLoading();
        }, 500);
      }

      this.firstTime = true;
      this.specialInfoLoaded = true;
  }
}

  ionViewWillLeave(){
    this.errorProfile = false;
    this.specialInfoError = false;
  }

  /**
   * Reloads the current user profile
   */
  public async reloadProfile(){
    this.errorProfile = false;
    this.loading.cargarLoading();

    try{
      await this.getUserFavourite3Songs().then(()=>{
        if(this.favouriteSong.id == '' || this.favouriteSong.id == undefined){
          this.specialInfoError = true;
        }
      });
      await this.getUserFavourite3Artists().then(()=>{
        if(this.favouriteArtist.id == '' || this.favouriteSong.id == undefined){
          this.specialInfoError = true;
        }  
      });    
                  
      await this.getUserProfile().then(()=>{
        this.loading.pararLoading();
      });
    }catch{
        this.errorProfile = true;
        setTimeout(() => {
          this.loading.pararLoading();
        }, 500);
      }

      this.firstTime = true;
      this.specialInfoLoaded = true;
  }

  /**
   * Get the signed in user profile
   */
  public async getUserProfile(){
    let u = await this.spotifyApi.getCurrentUserProfile();

      if(u.id == "antoniojl69" || u.id == "ciscu6"){
        this.isDeveloperAccount = true;
        this.clientCredentials.config.developerAccount = true;
      }
      try{
        this.clientCredentials.user.displayName = u.display_name;
        this.clientCredentials.user.spotifyURL = u.external_urls.spotify;
        this.clientCredentials.user.followers = u.followers.total;
        this.clientCredentials.user.id = u.id;
        if(u.images.length != 0){
          this.clientCredentials.user.image = u.images[0].url;  
        }
      }catch{
        console.log("Error en la obtención del perfil")
      }

  }

  /**
   * Get the signed in user's most played track
   */
  public async getUserFavourite3Songs(){
    let favSong = await this.spotifyApi.getCurrentUserTop3Songs();
    
    let userTrack:track;
    for(let i=0; i < favSong.items.length; i++){
      try{
        userTrack = {
        id: favSong.items[i].id,
        trackName: favSong.items[i].name,
        spotifyURL: favSong.items[i].external_urls.spotify,
        artists: favSong.items[i].artists,
        trackThumbnail: favSong.items[i].album.images[1].url,
      }
      this.loggedUser.tracks.push(userTrack);

      }catch{
        console.log("Error en la obtencion de la cancion")   
      }
    }

    try{
      this.favouriteSong.id = favSong.items[0].id;
      this.favouriteSong.trackName = favSong.items[0].name;
      this.favouriteSong.spotifyURL = favSong.items[0].external_urls.spotify;
      this.favouriteSong.artists = favSong.items[0].artists;
      this.favouriteSong.trackThumbnail = favSong.items[0].album.images[1].url;
    }catch{
      console.log("No se puede leer la canción favorita")        
    }
  }

  /**
   * Get the signed in user's most played artist
   */
  public async getUserFavourite3Artists(){
    let favArtist = await this.spotifyApi.getCurrentUserTop3Artist();

    let userArtist:artist;
    for(let i=0; i < favArtist.items.length; i++){
      try{
      userArtist = {
        name: favArtist.items[i].name, 
        image: favArtist.items[i].images[1].url,
        popularity: favArtist.items[i].popularity,
        spotifyURL: favArtist.items[i].external_urls.spotify,
        followers: favArtist.items[i].followers.total,
        top: 0
      }
      this.loggedUser.artists.push(userArtist);
      
      }catch{
        console.log("Error en la obtencion del artista")    
      }
    }

    try{
      this.favouriteArtist.name = favArtist.items[0].name;
      if(favArtist.items[0].images.length != 0){
        this.favouriteArtist.image = favArtist.items[0].images[1].url;
      }
      this.favouriteArtist.popularity = favArtist.items[0].popularity;
      this.favouriteArtist.spotifyURL = favArtist.items[0].external_urls.spotify,
      this.favouriteArtist.followers = favArtist.items[0].followers.total
    }catch{
      console.log("Error al leer el artista favorito")
    } 
  }
  /**
   * Opens the social page
   */
  async openFriendsPage(){
    this.navCtrl.navigateForward(['/social']);
  }

  /**
   * Popover with various options
   * @param ev popover event
   */
  
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ProfilepopoverComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true
    });
    await popover.present();
  }

  /**
   * Opens the client own profile in the Spotify App, if not installed, it can be opened in the browser instead 
   */
  public openUserProfile(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(this.loggedUser.spotifyURL, '_system', options);
  }

  /**
   * Opens the client's most played track in the Spotify App, if not installed, it can be opened in the browser instead  
   */
  public openFavouriteSong(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(this.favouriteSong.spotifyURL, '_system', options)
  }

  /**
   * Opens the client's most played artist in the Spotify App, if not installed, it can be opened in the browser instead 
   */
  public openFavouriteArtist(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no', 
    }
    const browser = this.inAppBrowser.create(this.favouriteArtist.spotifyURL, '_system', options)
  }

  /**
   * Allows the current client sign out from the app.
   */
  public logout(){
    this.loading.cargarLoading();
    setTimeout(() => {
      this.loading.pararLoading();
    }, 1000);
    this.authService.logout();
  }
}
