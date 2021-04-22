import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NavController, Platform } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ClientcredentialsService } from '../services/clientcredentials.service';
import { SpotifyApiService } from '../services/spotify-api.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

declare var cordova: any;

const MEDIA_FOLDER_NAME = "my_media";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

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
    private authService:AuthService) {}

  
  async ngOnInit(){
    this.plt.ready().then(()=>{
      let path = this.file.externalRootDirectory;
      //this.file.checkDir(path, MEDIA_FOLDER_NAME);
      //this.file.createDir(path, MEDIA_FOLDER_NAME, true);
      console.log(path);
    }, err => {
      let path = this.file.externalRootDirectory;
      
      console.log("hola");
    })
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

    /*this.file.moveFile(copyFrom, name, copyTo, newName).then(()=>{
      console.log("Copiado");
    },err => console.log("error: ", err))*/

    this.file.copyFile(copyFrom, name, copyTo, newName).then(()=>{
      console.log("Copiado");
    },err => console.log("error: ", err))
  }

  
}
