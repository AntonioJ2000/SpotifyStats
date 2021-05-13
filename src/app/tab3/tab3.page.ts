import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { track } from '../model/track';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { artist } from '../model/artist';
import { ProfilepopoverComponent } from '../components/profilepopover/profilepopover.component';
import { SocialPage } from '../pages/social/social.page';
import { Animation, AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { user } from '../model/user';
import { ApiUserService } from '../services/api-user.service';


const MEDIA_FOLDER_NAME = "my_media";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

  firstTime:boolean = false;
  specialInfoLoaded:boolean = false;
  loggedUser:user = this.clientCredentials.user;
  favouriteSong:track = {
    artists: [],
    id: '',
    previewURL: '',
    spotifyURL: '',
    trackName: '',
    trackThumbnail: ''
  };

  favouriteArtist:artist = {
    followers: 0,
    image: '',
    name: '',
    popularity: 0,
    spotifyURL: ''
  };
  
  status:string = "";
  audioFile:MediaObject;

  constructor(
    private media:Media, 
    private file:File, 
    private mediaCapture:MediaCapture,         
    private plt:Platform,
    public navCtrl:NavController,
    private loading:LoadingService,
    private clientCredentials:ClientcredentialsService,
    private spotifyApi:SpotifyApiService,
    private authService:AuthService,
    private inAppBrowser:InAppBrowser,
    public popoverController: PopoverController,
    private apiUser: ApiUserService,
    private router:Router) {}

  
    /**
     * If its the first time the user enters the view, load al his profile obtined via requests.
       (Not ngOnInit used due to performance issues)
    */
    ionViewDidEnter(){
      if(!this.firstTime){
        this.loading.cargarLoadingOscuro();

        setTimeout(async() => {
          await this.getUserProfile().then(async()=>{
            await this.getUserFavourite3Songs().then(async()=>{
              await this.getUserFavourite3Artists().then(async()=>{
                  await this.addUserToBBDD().then(()=>{
                    this.firstTime = true;
                    this.specialInfoLoaded = true;  
                    this.loading.pararLoading();
                });
              })
            });     
          });
        }, 750);
      }

    /*
    this.plt.ready().then(()=>{
      let path = this.file.externalRootDirectory;
      //this.file.checkDir(path, MEDIA_FOLDER_NAME);
      //this.file.createDir(path, MEDIA_FOLDER_NAME, true);
      console.log(path);
    }, err => {
      let path = this.file.externalRootDirectory;
      
      console.log("hola");
    })
    */
  }

  public async addUserToBBDD(){
    try{
      try{
        if(await this.apiUser.getUser(this.loggedUser.id)){
          await this.apiUser.updateUser(this.loggedUser).then(async()=>{
              console.log("He actualizado el usuario");
          });
        }
      }catch(err){
        console.log("He creado el usuario");
        await this.apiUser.createUser(this.loggedUser);
      }

    }catch(err){
      console.log("No se ha podido crear el usuario");
      console.log(err);
    }
  }

  /**
   * Get the signed in user profile
   */
  public async getUserProfile(){
    let u = await this.spotifyApi.getCurrentUserProfile();

      this.clientCredentials.user.displayName = u.display_name;
      this.clientCredentials.user.spotifyURL = u.external_urls.spotify;
      this.clientCredentials.user.followers = u.followers.total;
      this.clientCredentials.user.id = u.id;
      if(u.images.length != 0){
        this.clientCredentials.user.image = u.images[0].url;  
      }
  
  }

  /**
   * Get the signed in user's most played track
   */
  public async getUserFavourite3Songs(){
    let favSong = await this.spotifyApi.getCurrentUserTop3Songs();
    
    let userTrack:track;
    for(let i=0; i < favSong.items.length; i++){
        userTrack = {
        id: favSong.items[i].id,
        trackName: favSong.items[i].name,
        spotifyURL: favSong.items[i].external_urls.spotify,
        artists: favSong.items[i].artists,
        trackThumbnail: favSong.items[i].album.images[1].url,
      }
      this.loggedUser.tracks.push(userTrack);
    }

    //NO SIRVE PARA NADA SOLO PARA LA VISTA DE LOS AMIGOS
    let trackForFriendExample: track = {
      id: favSong.items[0].id,
      trackName: favSong.items[0].name,
      spotifyURL: favSong.items[0].external_urls.spotify,
      artists: favSong.items[0].artists,
      trackThumbnail: favSong.items[0].album.images[1].url,
      top: 0
    }

    this.favouriteSong.id = favSong.items[0].id;
    this.favouriteSong.trackName = favSong.items[0].name;
    this.favouriteSong.spotifyURL = favSong.items[0].external_urls.spotify;
    this.favouriteSong.artists = favSong.items[0].artists;
    this.favouriteSong.trackThumbnail = favSong.items[0].album.images[1].url;

    this.clientCredentials.exampleTrack = trackForFriendExample;
  }

  /**
   * Get the signed in user's most played artist
   */
  public async getUserFavourite3Artists(){
    let favArtist = await this.spotifyApi.getCurrentUserTop3Artist();

    let userArtist:artist;
    for(let i=0; i < favArtist.items.length; i++){
      userArtist = {
        name: favArtist.items[i].name, 
        image: favArtist.items[i].images[2].url,
        popularity: favArtist.items[i].popularity,
        spotifyURL: favArtist.items[i].external_urls.spotify,
        followers: favArtist.items[i].followers.total,
        top: 0
      }
      this.loggedUser.artists.push(userArtist);
    }

    //NO SIRVE PARA NADA SOLO PARA LA VISTA DE LOS AMIGOS
    let artistForFriendExample: artist = {
      name: favArtist.items[0].name, 
      image: favArtist.items[0].images[2].url,
      popularity: favArtist.items[0].popularity,
      spotifyURL: favArtist.items[0].external_urls.spotify,
      followers: favArtist.items[0].followers.total
    }

    this.favouriteArtist.name = favArtist.items[0].name;
    if(favArtist.items[0].images.length != 0){
      this.favouriteArtist.image = favArtist.items[0].images[2].url;
    }
    this.favouriteArtist.popularity = favArtist.items[0].popularity;
    this.favouriteArtist.spotifyURL = favArtist.items[0].external_urls.spotify,
    this.favouriteArtist.followers = favArtist.items[0].followers.total
  
    this.clientCredentials.exampleArtist = artistForFriendExample;
  }
  /**
   * Opens the social page
   */
  async openFriendsPage(){
    this.router.navigate(['/social']);
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

  /*
  public grabarAudio(){
    this.audioFile = this.media.create(this.file.externalRootDirectory+"/audiofile.mp3");
    this.audioFile.setRate(44100);
    this.audioFile.startRecord();
    this.status = "recording...";
  }

  public pararAudio(){
    this.audioFile.stopRecord();
    this.status = "stopped";

    this.file.readAsDataURL(this.file.externalRootDirectory, "audiofile.mp3").then((base64Audio) => {
      console.log(base64Audio.substring(23, base64Audio.length));
      console.log(base64Audio);
    })

  }

  public recordAudio(){
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {
        if(data.length > 0){
          console.log(data[0].fullPath);
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err:CaptureError) => console.error(err)
    )

  }


  public copyFileToLocalDir(fullPath){
    let myPath = fullPath;

    if(fullPath.indexOf('file://') < 0){
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/')+1);
    console.log(name);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/')+1);
    console.log(copyFrom);
    const copyTo = this.file.externalRootDirectory + MEDIA_FOLDER_NAME;
    console.log(copyTo);
    console.log(newName);

    this.file.checkFile(copyFrom, name).then((data)=>{
      console.log(data);
    })

    this.file.moveFile(copyFrom, name, copyTo, newName).then(()=>{
      console.log("Copiado");
    },err => console.log("error: ", err))

    this.file.copyFile(copyFrom, name, copyTo, newName).then(()=>{
      console.log("Copiado");
    },err => console.log("error: ", err))
  }
  */

}
