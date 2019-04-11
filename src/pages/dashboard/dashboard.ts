import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AppointmentsPage } from '../appointments/appointments';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { MyJobsPage } from '../my-jobs/my-jobs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginPage } from '../login/login';
import { Appointment } from '../../models/appointment';
import { AppliedJob, ViewedJob, SharedJob, Job } from '../../models/job';
import { ViewedJobsPage } from '../viewed-jobs/viewed-jobs';
import { Rating } from '../../models/rating';
import { RatingsPage } from '../ratings/ratings';
import { SettingsPage } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: any = {};

  postedJobs: Job[] = [];
  appointments: Appointment[] = [];
  raters = {
    iRated: [],
    ratedMe: []
  };
  myRating: string;
  viewedJobs: ViewedJob[] = [];
  sharedJobs: SharedJob[] = [];
  appliedJobs: AppliedJob[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth) {
  }


  ionViewDidLoad() {
    this.profile = this.navParams.get('user');

    if (this.dataProvider.userData) {
      this.postedJobs = this.dataProvider.userData.postedJobs;
      this.raters = this.dataProvider.userData.raters;
      this.appointments = this.dataProvider.userData.appointments;
      this.myRating = this.dataProvider.userData.myRating;
      this.raters = { iRated: this.dataProvider.userData.iRated, ratedMe: this.dataProvider.userData.ratedMe };
      this.viewedJobs = this.dataProvider.userData.viewedJobs;
      this.appliedJobs = this.dataProvider.userData.appliedJobs;
      this.sharedJobs = this.dataProvider.userData.sharedJobs;
    }
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  getJobsSummary(): number {
    return this.viewedJobs.length + this.appliedJobs.length + this.sharedJobs.length;
  }

  getRaters(): number {
    return this.raters ? this.raters.ratedMe.length + this.raters.iRated.length : 0;
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage, { appointments: this.appointments });
  }

  viewPostedJobs() {
    this.feedbackProvider.presentModal(MyJobsPage, { jobs: this.postedJobs });
  }

  viewViewedJobs() {
    this.feedbackProvider.presentModal(ViewedJobsPage, { data: { viewedJobs: this.viewedJobs, appliedJobs: this.appliedJobs, sharedJobs: this.sharedJobs } });
  }

  viewRaters() {
    this.feedbackProvider.presentModal(RatingsPage, { raters: this.raters });
  }

  editProfile() {
    this.navCtrl.push(SettingsPage);
  }

}
