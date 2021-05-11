import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendprofilePage } from './friendprofile.page';

const routes: Routes = [
  {
    path: '',
    component: FriendprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendprofilePageRoutingModule {}
