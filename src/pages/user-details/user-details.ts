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
  users: User[] = [];
  jobs: Job[] = [];
  viewedJobs: ViewedJob[] = [];
  appliedJobs: AppliedJob[] = [];
  sharedJobs: SharedJob[] = [];
  appointments: Appointment[] = [];

  user: UserData;
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
    // this.getUserDetails(this.navParams.get('user'));
    const user = this.navParams.get('user');
    this.profile = this.authProvider.getStoredUser();
    console.log(user);
    console.log(this.profile);

    const userData = {
      viewedJobs: [],
      appliedJobs: [],
      sharedJobs: [],
    }
    this.dataProvider.userData$.subscribe(data => {
      if (user.type === USER_TYPE.recruiter) {
        userData.viewedJobs = data.viewedJobs.filter(job => job.uid === user.uid);
        userData.appliedJobs = data.appliedJobs.filter(job => job.uid === user.uid);
        userData.sharedJobs = data.sharedJobs.filter(job => job.uid === user.uid);
      } else {
        userData.viewedJobs = data.viewedJobs.filter(job => job.rid === user.uid);
        userData.appliedJobs = data.appliedJobs.filter(job => job.rid === user.uid);
        userData.sharedJobs = data.sharedJobs.filter(job => job.rid === user.uid);
      }
      console.log(userData);
    });

    this.profile = this.authProvider.getStoredUser();
  }

  isUserInAppointment(user) {
    this.appointments.forEach(app => {
      if (app.uid === user.id && app.status === STATUS.inProgress) {
        this.hired = true;
      }
    });
  }

  getUserDetails(user) {
    this.dataProvider.userData$.subscribe(data => {

      if (user.type === USER_TYPE.recruiter) {
        this.init(user.rid, data);
        // this.user.postedJobs = data.postedJobs;
      } else {
        this.init(user.uid, data);
        this.isUserInAppointment(user);
      }

    });
  }

  init(id: string, data: UserData) {
    // this.users = data.users;
    // this.jobs = data.jobs;
    // this.appliedJobs = data.appliedJobs;
    // this.viewedJobs = data.viewedJobs;
    // this.sharedJobs = data.sharedJobs;
    // this.appointments = data.appointments;

    // this.user = new UserData(data);
    // console.log(this.user);


    // this.user.appliedJobs = data.appliedJobs.filter(job => job.rid === id);
    // this.user.viewedJobs = data.viewedJobs.filter(job => job.rid === id);
    // this.user.sharedJobs = data.sharedJobs.filter(job => job.rid === id);
    // this.user.appointments = data.appointments.filter(job => job.rid === id);
    // this.user.ratings = data.ratings;
  }

  isRecruiter(candidate): boolean {
    return this.authProvider.isRecruiter(candidate);
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
    const newUpdatedAppointment: Appointment = {
      uid: user.id,
      rid: this.profile.uid,
      status: STATUS.completed,
      dateCompleted: this.dateProvider.getDate()
    }
    this.dataProvider.updateItem(COLLECTION.appointments, newUpdatedAppointment, user.appointment.id).then(() => {
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


}
