import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, ModalController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
// import { Rating, Rate } from '../../models/Ratings';
// import { Error } from '../../models/error';
// import { RatingsModalPage } from '../ratings-modal/ratings-modal';


@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  profile: any;
  hired: boolean = false;
  settings: any;
  defaultImg: string = '';
  postedJobs: any = [];
  appliedJobs: any = [];
  viewedCandidates: any = [];
  appointments: any = [];
  appliedUsers: any = [];



  isRated: boolean = false;
  rating: number;
  // userRating: Rate;

  fromPage: string;
  didView: boolean;
  countViews: number;
  appointmentDate: string;

  candidateRating: string;


  candidate: User;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private ionEvent: Events,
    private modalCtrl: ModalController,
  ) {
    this.didView = false;
  }

  ionViewWillLeave() {
    if (this.isRated) {
      this.rateCandidate(this.rating);
      console.log("User rated :)", this.rating);
    }
  }

  ionViewDidLoad() {
    this.candidate = this.navParams.get('user');
    this.getMyRating(this.candidate);
    console.log(this.candidateRating);

  }

  getMyRating(candidate: User): number {
    let total = 0;
    let rate = 0;
    this.dataProvider.getCollectionByKeyValuePair(this.dataProvider.RATINGS_COLLECTION, 'uid', candidate.uid).subscribe(ratings => {
      if (ratings.length > 0) {
        ratings.forEach(rateObject => {
          total += rateObject.rating;
        });
        rate = total / ratings.length;
        this.candidateRating = rate.toFixed(1);
      };
    });
    return rate;
  }

  profilePicture(user): string {
    return `../../assets/imgs/users/${user.gender}.svg`;
  }

  loadMyAppliedJobs() {
  }

  hasAppointments() {
  }

  get canRateUser(): boolean {
    return this.fromPage === 'Appointments' || this.fromPage === 'Ratings';
  }

  get updateUserRate() {
    return 0;
    // const rate = this.rating > 0 ? (this.userRating.rating + this.rating) / 2 : this.userRating.rating;
    // return (Math.floor(rate * 100) / 100).toFixed(1);
  }

  get userCanBeRated(): boolean {
    console.log(this.appointments);

    return true; //this.candidate.appointments;
  }

  private hasViewedCandidate() {

  }

  private countViewedCandidates(viewed) {
    // let count = 0;
    // viewed.forEach(v => {
    //   if (v.candidate_id_fk == this.candidate.user_id) {
    //     count++;
    //   }
    // });
    // this.countViews = count;
  }


  private addToViewedHelper() {

  }

  private setData() {
  }

  // calculateRatings() {
  //   if (!this.ratings || !this.ratings.user_id_fk) {
  //     return {
  //       rating: this.rating,
  //       user_id_fk: this.candidate.user_id,
  //       count_raters: 1,
  //       date_rated: this.dataProvider.getDate()
  //     }
  //   } else {
  //     return {
  //       rating: (parseInt(this.ratings.rating) + this.rating) / 2,
  //       user_id_fk: this.candidate.user_id,
  //       count_raters: parseInt(this.ratings.count_raters) + 1,
  //       date_rated: this.dataProvider.getDate()
  //     }
  //   }
  // }


  calculateAverageRating(rating) {
    //  return this.userRating && this.userRating.rating ? (rating + this.userRating.rating) / 2 : rating;
  }

  rateCandidate(rating) {

  }

  rateUser(rating) {
    this.isRated = true;
    this.rating = rating;
  }

  logout() {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  getUserSettings(user, settingz) {
    let settings;
    let newSettings;
    settingz.forEach(s => {
      if (s.user_id_fk === user.user_id) {
        settings = s;
      }
    });
    if (settings && settings.hide_dob && settings.hide_email && settings.hide_phone && settings.hide_nationality) {
      newSettings = {
        hide_dob: settings.hide_dob === '1' ? true : false,
        hide_email: settings.hide_email === '1' ? true : false,
        hide_phone: settings.hide_phone === '1' ? true : false,
        hide_nationality: settings.hide_nationality === '1' ? true : false,
      }
    } else {
      newSettings = {
        hide_dob: false,
        hide_email: false,
        hide_phone: false,
        hide_nationality: false,
      };
    }
    return newSettings;
  }


  offerUserEmployment(user) {

  }

  hasBeenHired(user) {

  }

  completeCandidateAppointment(user) {

  }

  isRecruiter() {
    return this.profile && this.profile.type.toLowerCase() === 'recruiter' ? true : false;
  }

  completeAppointmentActionSheep(candidate) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to complete the appointment',
      buttons: [
        {
          text: 'Complete appointment',
          role: 'destructive',
          handler: () => {
            this.completeCandidateAppointment(candidate);
          }
        },
        {
          text: "Don't complete",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  getLastSeen(date): string {
    return '';// return this.dataProvider.getDateTime(date);
  }



  getDefaultProfilePic(profile) {
    return '';// return `${this.dataProvider.getMediaUrl()}${profile.gender}.svg`;
  }

  presentRateUserModal(user) {

  }

}
