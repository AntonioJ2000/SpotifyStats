import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { AboutPage } from 'src/app/pages/about/about.page';

@Component({
  selector: 'app-profilepopover',
  templateUrl: './profilepopover.component.html',
  styleUrls: ['./profilepopover.component.scss'],
})
export class ProfilepopoverComponent {

  constructor(public popoverController: PopoverController,
              public modalController:ModalController,
              private router: Router,
              private navCtrl:NavController) { }

  openConfigPage(){
    this.popoverController.dismiss();
    this.navCtrl.navigateRoot(['/configuration'])
  }

  /**
   * Opens the About Page in a modal.
   */
  async openAboutPage(){
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: AboutPage,
      cssClass: 'my-custom-class',
    });
    modal.present();
  }

}
