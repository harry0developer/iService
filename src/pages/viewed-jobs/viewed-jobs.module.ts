import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewedJobsPage } from './viewed-jobs';

@NgModule({
  declarations: [
    ViewedJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewedJobsPage),
  ],
})
export class ViewedJobsPageModule {}
