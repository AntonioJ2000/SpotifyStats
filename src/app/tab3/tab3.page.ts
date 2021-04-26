import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NavController, Platform } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { track } from '../model/track';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { artist } from '../model/artist';


const MEDIA_FOLDER_NAME = "my_media";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  loggedUser = this.clientCredentials.user;
  favouriteSong:track = {
    artists: [],
    id: '',
    previewURL: '',
    spotifyURL: '',
    trackName: '',
    trackThumbnail: '',
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
    private inAppBrowser:InAppBrowser) {}

  
  async ngOnInit(){
    this.loading.cargarLoading();

    

    await this.getUserProfile().then(async()=>{
      await this.getUserFavouriteSong().then(async()=>{
        await this.getUserFavouriteArtist().then(async()=>{
          setTimeout(async () => {
            await this.loading.pararLoading();
          }, 1000);
        })
      });     
    });
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


  public async getUserProfile(){
    let u = await this.spotifyApi.getCurrentUserProfile();

    this.clientCredentials.user.display_name = u.display_name;
    this.clientCredentials.user.external_urls = u.external_urls.spotify;
    this.clientCredentials.user.followers = u.followers.total;
    this.clientCredentials.user.id = u.id;
    this.clientCredentials.user.image = u.images[0].url;
    this.clientCredentials.user.type=u.type;
  }

  public async getUserFavouriteSong(){
    let favSong = await this.spotifyApi.getCurrentUserFavouriteSong();
    this.favouriteSong.id = favSong.items[0].id;
    this.favouriteSong.trackName = favSong.items[0].name;
    this.favouriteSong.spotifyURL = favSong.items[0].external_urls.spotify;
    this.favouriteSong.artists = favSong.items[0].artists;
    this.favouriteSong.trackThumbnail = favSong.items[0].album.images[1].url;

  }

  public async getUserFavouriteArtist(){
    let favArtist = await this.spotifyApi.getCurrentUserFavouriteArtist();

    this.favouriteArtist.name = favArtist.items[0].name;
    this.favouriteArtist.image = favArtist.items[0].images[1].url;
    this.favouriteArtist.popularity = favArtist.items[0].popularity;
    this.favouriteArtist.spotifyURL = favArtist.items[0].external_urls.spotify,
    this.favouriteArtist.followers = favArtist.items[0].followers.total
  
    console.log(this.favouriteArtist)
  }

  public openUserProfile(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(this.loggedUser.external_urls, '_system', options);
  }

  public openFavouriteSong(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(this.favouriteSong.spotifyURL, '_system', options)
  }

  public openFavouriteArtist(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create(this.favouriteArtist.spotifyURL, '_system', options)
  }

  public logout(){
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
