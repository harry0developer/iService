import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { slideIn, listSlideUp } from '../../utils/animations';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { LoginPage } from '../login/login';
import { AppliedJob } from '../../models/job';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [slideIn, listSlideUp]
})

export class ProfilePage {
  profile: any;
  job: any;
  countViewed: number;
  appliedViewed: number;
  viewedJobs: any = [];
  postedJobs: any = [];
  appointments: Appointment[];
  appliedJobs: AppliedJob[];

  settings: any = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false,
    hide_nationality: false,
  };
  lastImage: string;
  defaultImg: string = '';

  profileRating: string;

  constructor(
    private feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private navCtrl: NavController,
  ) { }

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

    const ratings = this.dataProvider.getMyRatings();
    Object.assign(this.profile, { rating: this.dataProvider.mapRatings(ratings.ratedMe) });

    // this.dataProvider.getCollectionByKeyValuePair(COLLECTION.ratings, id, this.profile.uid).subscribe(rating => {
    //   Object.assign(this.profile, { rating: this.dataProvider.mapRatings(rating) });
    // });
  }

  profilePicture(): string {
    return this.dataProvider.getProfilePicture();
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
    return this.authProvider.isRecruiter();
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
