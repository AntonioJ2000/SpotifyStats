import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage {

  constructor(public modalController: ModalController) { }

  closeSocialPage(){
    this.modalController.dismiss();
  }

  reloadSocial(){
    
  }
}
