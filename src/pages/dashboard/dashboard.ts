import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
// import { Profile } from '../../models/Profile';
// import { SettingsPage } from '../settings/settings';
// import { CardDetailsPage } from '../card-details/card-details';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { MyJobsPage } from '../my-jobs/my-jobs';
// import { Rate } from '../../models/Ratings';
// import { RatingsPage } from '../ratings/ratings';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {

  }


  profilePicture(): string {
    return '';
    // return this.dataProvider.getMediaUrl() + this.profile.picture;
  }

  editProfile() {
    // this.navCtrl.push(SettingsPage);
  }

  viewAppliedJobs() {
    // this.navCtrl.push(CardDetailsPage, { category: 'applied' });
  }

  viewViewedJobs() {
    // this.navCtrl.push(CardDetailsPage, { category: 'viewed' });
  }

  viewPostedJobs() {
    // this.navCtrl.push(MyJobsPage);
  }

  viewSharedJobs() {
    // this.navCtrl.push(CardDetailsPage, { category: 'shared' });
  }

  viewRaters() {
    // this.navCtrl.push(RatingsPage, { ratingsData: this.ratingsData });
  }

  getMyRaters(): number {
    return 0;
    // return this.ratingsData.ratedMe.length + this.ratingsData.iRated.length;
  }

}
