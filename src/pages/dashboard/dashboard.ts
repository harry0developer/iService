import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
// import { Profile } from '../../models/Profile';
// import { SettingsPage } from '../settings/settings';
// import { CardDetailsPage } from '../card-details/card-details';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { MyJobsPage } from '../my-jobs/my-jobs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginPage } from '../login/login';
// import { Rate } from '../../models/Ratings';
// import { RatingsPage } from '../ratings/ratings';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: any;
  jobs: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private feedbackProvider: FeedbackProvider,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.setUser();
    this.setJobs();

  }

  setUser() {
    this.dataProvider.getItemById(this.dataProvider.USERS_COLLECTION, this.authProvider.getStoredUser().uid).subscribe(user => {
      this.profile = user;
    });
  }

  setJobs() {
    this.jobs = this.dataProvider.getCollection(this.dataProvider.JOBS_COLLECTION, this.authProvider.getStoredUser().uid);
  }

  profilePicture(): string {
    return `../../assets/imgs/users/${this.profile.gender}.svg`;
  }

  isRecruiter(): boolean {
    return this.profile.type === 'recruiter';
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
