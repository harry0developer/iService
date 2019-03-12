import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    private authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    if (this.authProvider.getStoredUser()) {
      this.dataProvider.getItemById(this.dataProvider.USERS_COLLECTION, this.authProvider.getStoredUser().uid).subscribe(u => {
        const user: any = u;
        user.type == this.dataProvider.CANDIDATE_TYPE ? this.navCtrl.setRoot(JobsPage) : this.navCtrl.setRoot(CandidatesPage);
      });
    }
  }

  addUser() {
    const user: User = {
      firstname: 'Thabo',
      lastname: 'Papo',
      type: 'candidate',
      email: 'thabo@papo.com',
      password: '123456',
      createdAt: this.dateProvider.getDate(),
      phone: '0798829922',
      location: {
        latitude: '18.999',
        longitude: '-29.9999'
      }

    }
    this.authProvider.signUpWithEmailAndPassword(user).then(s => console.log).catch(err => console.log);
  }

  signinWithEmailAndPassword() {
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then((res) => {
      this.dataProvider.getItemById(this.dataProvider.USERS_COLLECTION, res.user.uid).subscribe(u => {
        const user: any = u;
        user.type == this.dataProvider.CANDIDATE_TYPE ? this.navCtrl.setRoot(JobsPage) : this.navCtrl.setRoot(CandidatesPage);
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
      this.dataProvider.getItemById(this.dataProvider.USERS_COLLECTION, res.user.uid).subscribe(u => {
        const user: any = u;
        user.type == this.dataProvider.CANDIDATE_TYPE ? this.navCtrl.setRoot(JobsPage) : this.navCtrl.setRoot(CandidatesPage);
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
      this.dataProvider.getItemById(this.dataProvider.USERS_COLLECTION, res.user.uid).subscribe(u => {
        const user: any = u;
        user.type == this.dataProvider.CANDIDATE_TYPE ? this.navCtrl.setRoot(JobsPage) : this.navCtrl.setRoot(CandidatesPage);
      });
    }).catch(err => {
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
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
