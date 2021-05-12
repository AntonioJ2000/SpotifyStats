import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AboutPage } from 'src/app/pages/about/about.page';

@Component({
  selector: 'app-profilepopover',
  templateUrl: './profilepopover.component.html',
  styleUrls: ['./profilepopover.component.scss'],
})
export class ProfilepopoverComponent {

  constructor(public popoverController: PopoverController,
              public modalController:ModalController) { }

  delocos(){
    this.popoverController.dismiss();
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
