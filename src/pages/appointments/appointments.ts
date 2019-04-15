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
  profile: any;
  appointment_type: string = 'inProgress';
  inProgressAppointments: User[];
  completedAppointments: User[];
  appointments: Appointment[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private dateProvider: DateProvider,
    private authProvider: AuthProvider,
    private viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.users$.subscribe(users => {
      this.dataProvider.userData$.subscribe(data => {
        if (this.profile.type === USER_TYPE.recruiter) {
          const appointments = data.appointments.filter(job => job.rid === this.profile.uid);
          const usersWithAppointments = this.dataProvider.getUserWithAppointmets(this.profile, users, appointments);
          this.completedAppointments = usersWithAppointments.filter(user => user.appointment.status === STATUS.completed);
          this.inProgressAppointments = usersWithAppointments.filter(user => user.appointment.status === STATUS.inProgress);
        } else {
          const appointments = data.appointments.filter(job => job.uid === this.profile.uid);
          console.log(appointments);

          const usersWithAppointments = this.dataProvider.getUserWithAppointmets(this.profile, users, appointments);
          console.log(usersWithAppointments);

          this.completedAppointments = usersWithAppointments.filter(user => user.appointment.status === STATUS.completed);
          this.inProgressAppointments = usersWithAppointments.filter(user => user.appointment.status === STATUS.inProgress);
        }
      });
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
