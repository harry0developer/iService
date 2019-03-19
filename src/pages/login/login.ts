import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardPage } from '../dashboard/dashboard';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { CandidatesPage } from '../candidates/candidates';
import { JobsPage } from '../jobs/jobs';
import { DateProvider } from '../../providers/date/date';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/const';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  data = {
    email: '',
    password: ''
  }
  type = 'password';
  showPass = false;

  constructor(
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public dateProvider: DateProvider,
    public feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private ionEvents: Events) {
  }

  ionViewDidLoad() {
    if (this.authProvider.isLoggedIn()) {
      this.navigate(this.authProvider.getStoredUser());
    }
  }

  addUser() {
    const user: User = {
      firstname: 'Lesang',
      lastname: 'Chini',
      type: 'candidate',
      gender: 'female',
      email: 'lesang@chini.com',
      password: '123456',
      dateCreated: this.dateProvider.getDate(),
      phone: '0798829922',
      location: {
        latitude: '18.999',
        longitude: '-29.9999'
      }

    }
    this.authProvider.signUpWithEmailAndPassword(user).then(s => console.log).catch(err => console.log);
  }

  signinWithEmailAndPassword() {
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.navigate(u);
      });
    }).catch(err => {
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithFacebook() {
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.navigate(u);
      });
    }).catch(err => {
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithTwitter() {
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.navigate(u);
      });
    }).catch(err => {
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  navigate(user) {
    this.ionEvents.publish(EVENTS.loggedIn, { user });
    this.authProvider.storeUser(user);
    user.type == USER_TYPE.recruiter ? this.navCtrl.setRoot(CandidatesPage) : this.navCtrl.setRoot(JobsPage);

  }

  goToSignup() {
    this.navCtrl.setRoot(SignupPage);
  }

  goToForgotPassword() {
    this.navCtrl.setRoot(ForgotPasswordPage);
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
