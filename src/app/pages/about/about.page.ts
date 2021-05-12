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

  /**
   * Closes the modal created to open this page. 
   */
  closeModal(){
    this.modalController.dismiss();
  }

  /**
   * Opens the Twitter App with the Dev1 profile. If not installed, opens it in a web browser.
   */
  public openDev1Twitter(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://twitter.com/antoniojl2000','_system', options);
  }

  /**
   * Opens the Twitter App with the Dev2 profile. If not installed, opens it in a web browser.
   */
  public openDev2Twitter(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://twitter.com/ciscu24','_system', options);
  }
  
  /**
   * Opens the Instagram App with the Dev2 profile. If not installed, opens it in a web browser.
   */
  public openDev2Instagram(){
    const options: InAppBrowserOptions = {
      toolbar: 'yes',
      zoom: 'no'
    }
    this.inAppBrowser.create('https://instagram.com/ciscu24','_system', options);
  }

}
