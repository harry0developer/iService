import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, ModalController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, EVENTS, STATUS } from '../../utils/const';
import { RatingData } from '../../models/rating';
import { Appointment } from '../../models/appointment';
import { DateProvider } from '../../providers/date/date';
import { ViewedJob, Job, AppliedJob } from '../../models/job';
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
  viewedCandidates: any = [];
  appliedUsers: any = [];

  postedJobs: Job[] = [];
  appliedJobs: AppliedJob[] = [];
  viewedJobs: ViewedJob[] = [];
  appointments: Appointment[] = [];



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
    private authProvider: AuthProvider,
    private dateProvider: DateProvider,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private ionEvent: Events,
    private modalCtrl: ModalController,
  ) {
    this.didView = false;
  }


  ionViewDidLoad() {
    this.candidate = this.navParams.get('user');
    this.profile = this.authProvider.getStoredUser();
    this.appointments = this.dataProvider.appointments;
    this.isUserInAppointment(this.candidate);
    this.getMyRating(this.candidate);

    if (this.isRecruiter()) {
      this.postedJobs = this.dataProvider.getMyJobs();
    } else {
      this.appliedJobs = this.dataProvider.getMyAppliedJobs();
    }
    this.viewedJobs = this.dataProvider.getMyViewedJobs();
    this.appointments = this.dataProvider.getMyAppointments();
  }

  isUserInAppointment(user) {
    this.appointments.forEach(app => {
      if (app.uid === user.id && app.status === STATUS.inProgress) {
        this.hired = true;
      }
    });
  }

  getMyRating(candidate: User) {
    let total = 0;
    let rate = 0;
    const ratings: RatingData = this.dataProvider.getMyRatings();
    this.candidateRating = this.dataProvider.mapRatings(ratings.ratedMe);
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter();
  }

  profilePicture(user): string {
    return `../../assets/imgs/users/${user.gender}.svg`;
  }

  makeAppointment(user) {
    this.feedbackProvider.presentLoading();
    const appointment: Appointment = {
      uid: user.id,
      rid: this.profile.uid,
      status: STATUS.inProgress,
      dateCreated: this.dateProvider.getDate(),
      dateCompleted: '',
    }
    this.dataProvider.addNewItem(COLLECTION.appointments, appointment).then(() => {
      this.ionEvent.publish(EVENTS.appointmentsUpdated);
      this.hired = true;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment made successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }


  completeAppointment(user) {
    this.feedbackProvider.presentLoading();
    const appointment: Appointment = {
      uid: user.id,
      rid: this.profile.uid,
      status: STATUS.completed,
      dateCompleted: this.dateProvider.getDate()
    }
    this.dataProvider.addNewItem(COLLECTION.appointments, appointment).then(() => {
      this.ionEvent.publish(EVENTS.appointmentsUpdated);
      this.hired = false;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment completed successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }

  completeAppointmentActionSheep(candidate) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to complete the appointment',
      buttons: [
        {
          text: 'Complete appointment',
          role: 'destructive',
          handler: () => {
            this.completeAppointment(candidate);
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



  hasBeenHired(user) {

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
