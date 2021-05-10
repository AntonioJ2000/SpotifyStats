import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {

  constructor(private modalController:ModalController,
              private inAppBrowser:InAppBrowser) { }


  closeModal(){
    this.modalController.dismiss();
  }


  public openDev1Twitter(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://twitter.com/antoniojl2000','_system', options);
  }

  public openDev2Twitter(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://twitter.com/ciscu24','_system', options);
  }

  public openDev2Instagram(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://instagram.com/ciscu24','_system', options);
  }

}
