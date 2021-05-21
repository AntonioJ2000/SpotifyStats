import { Component } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { AboutPage } from 'src/app/pages/about/about.page';
import { ClientcredentialsService } from 'src/app/services/clientcredentials.service';

@Component({
  selector: 'app-profilepopover',
  templateUrl: './profilepopover.component.html',
  styleUrls: ['./profilepopover.component.scss'],
})
export class ProfilepopoverComponent {

  developerAccount:boolean = this.clientCredentials.config.developerAccount;

  constructor(public popoverController: PopoverController,
              public modalController:ModalController,
              private navCtrl:NavController,
              private clientCredentials:ClientcredentialsService) { }

  openConfigPage(){
    this.popoverController.dismiss();
    this.navCtrl.navigateRoot(['/configuration']);
  }

  openIssueList(){
    this.popoverController.dismiss();
    this.navCtrl.navigateForward(['/support']);
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
