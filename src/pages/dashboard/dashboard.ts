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
import { Rating, RatingData } from '../../models/rating';
import { RatingsPage } from '../ratings/ratings';
import { SettingsPage } from '../settings/settings';
import { UserData } from '../../models/data';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: any = {};

  postedJobs: Job[] = [];
  appointments: Appointment[] = [];
  ratings: RatingData;
  viewedJobs: ViewedJob[] = [];
  sharedJobs: SharedJob[] = [];
  appliedJobs: AppliedJob[] = [];

  userData: UserData;

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
    this.dataProvider.userData$.subscribe(data => {
      this.profile = data.profile;
      this.appliedJobs = data.appliedJobs;
      this.viewedJobs = data.viewedJobs;
      this.sharedJobs = data.sharedJobs;
      this.appointments = data.appointments;
      this.postedJobs = data.postedJobs;
      this.ratings = data.ratings;
    });
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  getJobsSummary(): number {
    return this.viewedJobs.length + this.appliedJobs.length + this.sharedJobs.length;
  }

  getRaters(): number {
    return this.ratings ? this.ratings.ratedMe.length + this.ratings.iRated.length : 0;
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  viewAppointments() {
    this.feedbackProvider.presentModal(AppointmentsPage);
  }

  viewPostedJobs() {
    this.feedbackProvider.presentModal(MyJobsPage);
  }

  viewViewedJobs() {
    this.feedbackProvider.presentModal(ViewedJobsPage);
  }

  viewRaters() {
    this.feedbackProvider.presentModal(RatingsPage);
  }

  editProfile() {
    this.navCtrl.push(SettingsPage);
  }

}
