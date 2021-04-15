import { Component } from '@angular/core';
import { ApiNodeService } from '../services/api-node.service';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { SpotifyAuth } from '@ionic-native/spotify-auth/ngx';
import { NavController } from '@ionic/angular';

declare var cordova: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  

  result={};
  status:string = "";
  audioFile:MediaObject;

  constructor(private apiNode:ApiNodeService, private media:Media, private file:File,
              private spotifyAuth: SpotifyAuth, public navCtrl:NavController) {}

  ionViewWillEnter(){
    console.log("VOLVEMOS")
  }

  public login(){
    const config = {
      clientId: "6c3f918a4ab240db97b1c104475c8ea6",
      redirectUrl: "spotifystats://callback",
      scopes: ["user-read-recently-played", "streaming", "playlist-read-private", "playlist-read-collaborative", "user-top-read"],
      tokenExchangeUrl: "https://ajsstats.herokuapp.com/exchange",
      tokenRefreshUrl: "https://ajsstats.herokuapp.com/refresh"
    };

   cordova.plugins.spotifyAuth.authorize(config)
   .then((data) =>{
     this.result = data.accessToken;
   });
   
  }


  public grabarAudio(){
    this.audioFile = this.media.create(this.file.externalRootDirectory+"/audiofile.mp3");
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

  
}
