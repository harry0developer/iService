import { Component } from '@angular/core';
import { IonicPage, Events, ModalController, ActionSheetController, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { slideIn, listSlideUp } from '../../utils/animations';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';


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
  appliedJobs: any = [];
  viewedJobs: any = [];
  postedJobs: any = [];
  appointments: any = [];
  settings: any = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false,
    hide_nationality: false,
  };
  lastImage: string;
  defaultImg: string = '';
  // userRatings: Rate;

  constructor(
    private events: Events,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
    private platform: Platform,
    private authProvider: AuthProvider
  ) {
  }


  ionViewDidLoad() {
    this.authProvider.getFirebaseUserData(this.authProvider.getStoredUser().uid).subscribe(user => {
      this.profile = user.data();
    });
  }


  profilePicture(): string {
    return `../../assets/imgs/users/${this.profile.gender}.svg`;
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

  isRecruiter() {
    return this.profile.type.toLowerCase() === 'recruiter' ? true : false;
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
