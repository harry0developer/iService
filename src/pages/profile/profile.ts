import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { slideIn, listSlideUp } from '../../utils/animations';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { LoginPage } from '../login/login';
import { AppliedJob, Job, ViewedJob, SharedJob } from '../../models/job';
import { RatingData } from '../../models/rating';
import { SettingsPage } from '../settings/settings';

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
    private dataProvider: DataProvider,
    private modalCtrl: ModalController
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {
      this.profile = data.users.filter(user => user.uid === this.profile.uid)[0];
      this.appliedJobs = data.appliedJobs;
      this.sharedJobs = data.sharedJobs;
      this.viewedJobs = data.viewedJobs;
      if (this.profile.type === USER_TYPE.recruiter) {
        this.appointments = data.appointments.filter(appointment => appointment.rid === this.profile.uid);
        this.postedJobs = data.jobs.filter(job => job.uid === this.profile.uid);
        this.ratings.iRated = data.ratings.filter(rater => rater.rid === this.profile.uid);
        this.ratings.ratedMe = data.ratings.filter(rater => rater.uid === this.profile.uid);
        this.myRating = this.dataProvider.getMyRating(this.ratings.ratedMe);
      } else {
        this.appointments = data.appointments.filter(appointment => appointment.uid === this.profile.uid);
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
