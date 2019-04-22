import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { slideIn, listSlideUp } from '../../utils/animations';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { LoginPage } from '../login/login';
import { AppliedJob, Job, ViewedJob, SharedJob } from '../../models/job';
import { RatingData } from '../../models/rating';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [slideIn, listSlideUp]
})

export class ProfilePage {
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

  constructor(
    private feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {

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

  getSettings(): any {

  }

  getAppliedJobs() {

  }

  getAppointments() {

  }

  getViewedJobs() {

  }

  getPostedJobs() {

  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }


  settingsPage() {

  }

  updateSettings() {

  }

  public presentActionSheet() {

  }

  public takePicture(sourceType) {
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {

  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {

  }

  saveFilenameToDB(filename: string) {

  };

  showErrorMessage() {
    this.feedbackProvider.presentAlert("Ooops!", "Something went wrong changing the profile picture, please try again.");
  }

}
