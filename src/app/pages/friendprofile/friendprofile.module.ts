import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendprofilePageRoutingModule } from './friendprofile-routing.module';

import { FriendprofilePage } from './friendprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendprofilePageRoutingModule
  ],
  declarations: [FriendprofilePage]
})
export class FriendprofilePageModule {}
