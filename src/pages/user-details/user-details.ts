import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, EVENTS, STATUS, USER_TYPE, } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { DateProvider } from '../../providers/date/date';
import { ViewedJob, Job, AppliedJob, SharedJob } from '../../models/job';
import { UserData } from '../../models/data';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {


  profile: User;
  viewedJobs: ViewedJob[] = [];
  appliedJobs: AppliedJob[] = [];
  sharedJobs: SharedJob[] = [];
  postedJobs: Job[] = [];
  appointments: Appointment[] = [];
  appointment: any;
  appointmentsInProgress: Appointment[] = [];
  rating: string;

  user: User;
  hired: boolean = false;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private dateProvider: DateProvider,
    private actionSheetCtrl: ActionSheetController,
    private ionEvent: Events,
  ) {

  }


  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {
      if (this.user.type === USER_TYPE.recruiter) {
        this.viewedJobs = data.viewedJobs.filter(job => job.rid === this.user.uid);
        this.appliedJobs = data.appliedJobs.filter(job => job.rid === this.user.uid);
        this.sharedJobs = data.sharedJobs.filter(job => job.rid === this.user.uid);
        this.postedJobs = data.jobs.filter(job => job.uid === this.user.uid);
        this.appointments = data.appointments.filter(app => app.rid === this.user.uid);
        this.appointmentsInProgress = data.appointments.filter(app => app.rid === this.user.uid && app.status === STATUS.inProgress);
      } else {
        this.viewedJobs = data.viewedJobs.filter(job => job.uid === this.user.uid);
        this.appliedJobs = data.appliedJobs.filter(job => job.uid === this.user.uid);
        this.sharedJobs = data.sharedJobs.filter(job => job.uid === this.user.uid);
        this.appointments = data.appointments.filter(app => app.uid === this.user.uid);
        this.appointmentsInProgress = data.appointments.filter(app => app.uid === this.user.uid && app.status === STATUS.inProgress);
        this.isUserInAppointment();
      }
      this.rating = this.dataProvider.getMyRating(data.ratings.filter(user => user.uid === this.user.uid));
    });
  }

  isUserInAppointment() {
    this.appointments.forEach(app => {
      if (app.uid === this.user.uid && app.status === STATUS.inProgress) {
        this.hired = true;
        this.appointment = app;
      }
    });
  }

  isRecruiter(user): boolean {
    return this.authProvider.isRecruiter(user);
  }

  profilePicture(user): string {
    return `../../assets/imgs/users/${user.gender}.svg`;
  }

  hasAppointments() {
    return false;
  }

  updateAppointment() {
    this.feedbackProvider.presentLoading();
    this.appointment.status = STATUS.completed;
    this.appointment.dateCompleted = this.dateProvider.getDate();
    this.dataProvider.updateItem(COLLECTION.appointments, this.appointment, this.appointment.id).then(() => {
      this.hired = false;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment completed successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }

  createAppointment() {
    this.feedbackProvider.presentLoading();
    const appointment: Appointment = {
      uid: this.user.id,
      rid: this.profile.uid,
      status: STATUS.inProgress,
      dateCreated: this.dateProvider.getDate(),
      dateCompleted: ''
    }
    this.dataProvider.addNewItem(COLLECTION.appointments, appointment).then(() => {
      this.hired = true;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Appointment made successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Making appointment', 'An error occured while making an appointment');
    });
  }


  completeAppointmentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to complete the appointment',
      buttons: [
        {
          text: 'Complete appointment',
          role: 'destructive',
          handler: () => {
            this.updateAppointment();
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


}
