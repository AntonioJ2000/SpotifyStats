import { Component } from '@angular/core';
import { ApiNodeService } from '../services/api-node.service';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  status:string = "";
  audioFile:MediaObject;

  constructor(private apiNode:ApiNodeService, private media:Media, private file:File) {}

  public async login(){
    const d = await this.apiNode.Authorize();
    console.log(d);
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
