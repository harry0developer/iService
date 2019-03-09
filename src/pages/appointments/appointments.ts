import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';

@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
  animations: [bounceIn]
})
export class AppointmentsPage {
  profile: any;
  inProgressAppointments: any = [];
  completedAppointments: any = [];
  mappedAppointments: any = [];
  recruiters: any = [];
  candidates: any = [];
  appointment_type: string = 'inProgress';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private events: Events
  ) { }

  ionViewDidLoad() {

  }

  setAppointments() {
    if (this.isRecruiter()) {
      this.mapRecruiterAppointments();
    } else {
      this.mapCandidateAppointments();
    }
    this.initializeAppointments();
  }


  initializeAppointments() {
  }


  mapAppointments(appointments, users) {
    const appointedUsers = [];
    appointments.forEach(app => {
      users.forEach(user => {
        if (app.recruiter_id_fk === this.profile.user_id && app.candidate_id_fk === user.user_id) {
          appointedUsers.push(Object.assign(user, { appointment: app }));
        }
      });
    });
    return appointedUsers;
  }

  mapRecruiterAppointments() {
    this.inProgressAppointments.forEach(app => {
      if (app.recruiter_id_fk === this.profile.user_id) {
        this.setRecruiterAppointments(app);
      }
    });
  }

  setRecruiterAppointments(app) {
    this.candidates.forEach(candidate => {
      if (app.candidate_id_fk === candidate.user_id) {
        this.mappedAppointments.push(candidate);
      }
    });
  }

  mapCandidateAppointments() {
    this.inProgressAppointments.forEach(app => {
      if (app.candidate_id_fk === this.profile.user_id) {
        this.setCandidateAppointments(app);
      }
    });
  }

  setCandidateAppointments(app) {
    this.recruiters.forEach(recruiter => {
      if (app.recruiter_id_fk === recruiter.user_id) {
        this.mappedAppointments.push(recruiter);
      }
    });
  }

  isRecruiter(): boolean {
    return this.profile.type.toLowerCase() === 'recruiter' ? true : false;
  }

  viewUserDetails(candidate) {
    //this.navCtrl.push(UserDetailsPage, { user: candidate, page: 'Appointments' });
  }

  getDateAppointed(user) {
    //return this.dataProvider.getDateTime(user.appointment.date_completed);
  }

  getDateScheduled(user) {
    // return this.dataProvider.getDateTime(user.appointment.date_created);
  }

  profilePicture(profile) {
    // return this.dataProvider.getMediaUrl() + profile.picture;
  }

  getDefaultProfilePic(profile) {
    // return `${this.dataProvider.getMediaUrl()}${profile.gender}.svg`;
  }

}
