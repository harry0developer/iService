import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewUsersPage } from './view-users';

@NgModule({
  declarations: [
    ViewUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewUsersPage),
  ],
})
export class ViewUsersPageModule {}
