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
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { User } from '../../models/user';
// import { Rate } from '../../models/Ratings';
// import { RatingsPage } from '../ratings/ratings';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: any;
  postedJobs: any;
  appointments: Appointment[];
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
    if (!this.authProvider.isLoggedIn()) {
      localStorage.clear();
      this.navCtrl.setRoot(LoginPage);
    } else {
      this.profile = this.authProvider.profile;
    }
    this.initialize();
  }

  initialize() {
    let id = this.isRecruiter() ? 'rid' : 'uid';
    if (this.isRecruiter()) {
      this.postedJobs = this.dataProvider.getMyJobs();
    }
    this.appointments = this.dataProvider.getMyAppointments();
    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, id, this.profile.uid).subscribe(rating => {
      Object.assign(this.profile, { rating: this.dataProvider.mapRatings(rating) });
    });
  }

  profilePicture(): string {
    return `../../assets/imgs/users/${this.profile.gender}.svg`;
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter();
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage, { appointments: this.appointments });
    // this.navCtrl.push(AppointmentsPage, { appointments: this.appointments });
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
