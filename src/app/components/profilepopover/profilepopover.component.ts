import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-profilepopover',
  templateUrl: './profilepopover.component.html',
  styleUrls: ['./profilepopover.component.scss'],
})
export class ProfilepopoverComponent {

  constructor(public popoverController: PopoverController) { }

  delocos(){
    this.popoverController.dismiss();
  }

}
