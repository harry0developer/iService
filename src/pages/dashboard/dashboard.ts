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
import { JobDetailsPage } from '../job-details/job-details';
import { AppliedJob, ViewedJob, SharedJob } from '../../models/job';
import { ViewedJobsPage } from '../viewed-jobs/viewed-jobs';
import { Rating, RatingData } from '../../models/rating';
import { RatingsPage } from '../ratings/ratings';
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

  appliedJobs: AppliedJob[];
  viewedJobs: ViewedJob[];
  sharedJobs: SharedJob[];
  jobsSummary: any;
  ratingsData: RatingData;

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

    this.appliedJobs = this.dataProvider.getMyAppliedJobs();
    this.viewedJobs = this.dataProvider.getMyViewedJobs();
    this.sharedJobs = this.dataProvider.getMySharedJobs();
    this.ratingsData = this.dataProvider.getMyRatings();

    this.jobsSummary = {
      applied: this.appliedJobs,
      viewed: this.viewedJobs,
      shared: this.sharedJobs,
    }


    const ratings = this.dataProvider.getMyRatings();
    Object.assign(this.profile, { rating: this.dataProvider.mapRatings(ratings.ratedMe) });

    // this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, id, this.profile.uid).subscribe(rating => {
    //   Object.assign(this.profile, { rating: this.dataProvider.mapRatings(rating) });
    // });
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture();
  }

  countMyRaters(): number {
    return this.ratingsData.ratedMe.length + this.ratingsData.iRated.length;
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter();
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage, { appointments: this.appointments });
  }

  viewPostedJobs() {
    this.feedbackProvider.presentModal(MyJobsPage, { jobs: this.postedJobs });
  }

  getJobSummary(): number {
    return this.jobsSummary.viewed.length + this.jobsSummary.applied.length + this.jobsSummary.shared.length;
  }

  viewViewedJobs() {
    this.feedbackProvider.presentModal(ViewedJobsPage, { category: 'viewed', data: this.jobsSummary });
  }

  viewRaters() {
    this.feedbackProvider.presentModal(RatingsPage, { ratingsData: this.ratingsData });
  }


  editProfile() {
    // this.navCtrl.push(SettingsPage);
  }

  viewAppliedJobs() {
    // this.navCtrl.push(CardDetailsPage, { category: 'applied' });
  }



  viewSharedJobs() {
    // this.navCtrl.push(CardDetailsPage, { category: 'shared' });
  }




}
