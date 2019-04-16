import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Appointment } from '../../models/appointment';
import { STATUS, USER_TYPE } from '../../utils/const';
import { DateProvider } from '../../providers/date/date';
import { UserDetailsPage } from '../user-details/user-details';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
  animations: [bounceIn]
})
export class AppointmentsPage {
  appointment_type: string = 'inProgress';
  profile: any;
  inProgressAppointments: User[];
  completedAppointments: User[];


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private dateProvider: DateProvider,
    private authProvider: AuthProvider,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {
      if (this.profile.type === USER_TYPE.recruiter) {
        const inProgressAppointments = data.appointments.filter(app => app.rid === this.profile.uid && app.status === STATUS.inProgress);
        const completedAppointments = data.appointments.filter(app => app.rid === this.profile.uid && app.status === STATUS.completed);
        this.inProgressAppointments = this.dataProvider.getMappedCandidates(data.users, inProgressAppointments);
        this.completedAppointments = this.dataProvider.getMappedCandidates(data.users, completedAppointments);
      } else {
        const inProgressAppointments = data.appointments.filter(app => app.uid === this.profile.uid && app.status === STATUS.inProgress);
        const completedAppointments = data.appointments.filter(app => app.uid === this.profile.uid && app.status === STATUS.completed);
        this.inProgressAppointments = this.dataProvider.getMappedRecruiters(data.users, inProgressAppointments);
        this.completedAppointments = this.dataProvider.getMappedRecruiters(data.users, completedAppointments);
      }
    });
  }

  profilePicture(user): string {
    return `../../assets/imgs/users/${user.gender}.svg`;
  }

  getDateScheduled(date: string) {
    return this.dateProvider.getDateFromNow(date);
  }

  getDateCompleted(date: string) {
    return this.dateProvider.getDateFromNow(date);
  }

  viewUserDetails(user: User) {
    this.navCtrl.push(UserDetailsPage, { user });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
