import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Appointment } from '../../models/appointment';
import { APPOINTMENT_STATUS, COLLECTION } from '../../utils/const';
import { filter, take } from 'rxjs/operators';
import { app } from 'firebase';
import { forkJoin } from 'rxjs';
import { DateProvider } from '../../providers/date/date';
import { UserDetailsPage } from '../user-details/user-details';

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
    this.getUsers();
  }

  getUsers() {
    const id = this.authProvider.isRecruiter() ? 'rid' : 'uid';
    forkJoin(
      this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appointments, id, this.profile.uid).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.users).pipe(take(1))
    ).subscribe(([appointments, users]) => {
      const usersWithAppointments = this.getUserWithAppointmets(users, appointments);
      this.completedAppointments = usersWithAppointments.filter(user => user.appointment.status === APPOINTMENT_STATUS.completed);
      this.inProgressAppointments = usersWithAppointments.filter(user => user.appointment.status === APPOINTMENT_STATUS.inProgress);
    });
  }

  getUserWithAppointmets(users: User[], appointments: Appointment[]) {
    const userz = [];

    users.map(user => {
      appointments.map(app => {
        if (user.uid === app.uid) {
          userz.push(Object.assign(user, { appointment: app }));
        }
      })
    })
    return userz;
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
