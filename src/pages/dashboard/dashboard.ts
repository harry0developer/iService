import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
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
import { USER_TYPE, COLLECTION } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profile: any = {};

  postedJobs: Job[] = [];
  appointments: Appointment[] = [];
  ratings: RatingData = {
    iRated: [],
    ratedMe: []
  };
  myRating: string;
  viewedJobs: ViewedJob[] = [];
  sharedJobs: SharedJob[] = [];
  appliedJobs: AppliedJob[] = [];

  userData: UserData;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth) {
  }


  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();

    this.dataProvider.userData$.subscribe(data => {
      this.profile = data.users.filter(user => user.uid === this.profile.uid)[0];
      if (this.profile.type === USER_TYPE.recruiter) {
        const applied = data.appliedJobs.filter(job => job.rid === this.profile.uid);
        const viewed = data.viewedJobs.filter(job => job.rid === this.profile.uid);
        const shared = data.sharedJobs.filter(job => job.rid === this.profile.uid);

        this.appliedJobs = this.dataProvider.removeDuplicates(applied, 'jid');
        this.sharedJobs = this.dataProvider.removeDuplicates(shared, 'jid');
        this.viewedJobs = this.dataProvider.removeDuplicates(viewed, 'jid');

        this.appointments = data.appointments.filter(job => job.rid === this.profile.uid);
        this.postedJobs = data.jobs.filter(job => job.uid === this.profile.uid);
        this.ratings.iRated = data.ratings.filter(rater => rater.rid === this.profile.uid);
        this.ratings.ratedMe = data.ratings.filter(rater => rater.uid === this.profile.uid);
        this.myRating = this.dataProvider.getMyRating(this.ratings.ratedMe);
      } else {
        const applied = data.appliedJobs.filter(job => job.uid === this.profile.uid);
        const viewed = data.viewedJobs.filter(job => job.uid === this.profile.uid);
        const shared = data.sharedJobs.filter(job => job.uid === this.profile.uid);

        this.appliedJobs = this.dataProvider.removeDuplicates(applied, 'jid');
        this.viewedJobs = this.dataProvider.removeDuplicates(shared, 'jid');
        this.sharedJobs = this.dataProvider.removeDuplicates(viewed, 'jid');

        this.appointments = data.appointments.filter(job => job.uid === this.profile.uid);
        this.ratings.iRated = data.ratings.filter(rater => rater.rid === this.profile.uid);
        this.ratings.ratedMe = data.ratings.filter(rater => rater.uid === this.profile.uid);
        this.myRating = this.dataProvider.getMyRating(this.ratings.ratedMe);
      }
    });
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture(this.profile);
  }

  getJobsSummary(): number {
    return this.viewedJobs.length + this.appliedJobs.length + this.sharedJobs.length || 0;
  }

  getRaters(): number {
    return this.ratings && this.ratings.iRated && this.ratings.ratedMe ? this.ratings.ratedMe.length + this.ratings.iRated.length : 0;
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
    let modal = this.modalCtrl.create(SettingsPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.updateSettings();
      }
    });
    modal.present();
  }

  updateSettings() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.updateItem(COLLECTION.users, this.profile, this.profile.id).then(() => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Settings updated successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
    });
  }
}
