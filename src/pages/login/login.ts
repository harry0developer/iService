import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardPage } from '../dashboard/dashboard';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { USER_NOT_FOUND, INVALID_PASSWORD } from '../../config';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { DateProvider } from '../../providers/date/date';
import { COLLECTION, USER_TYPE, EVENTS } from '../../utils/const';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserData } from '../../models/data';

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

  signinWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.feedbackProvider.dismissLoading();
        this.navigate(u);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithFacebook() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.feedbackProvider.dismissLoading();
        this.navigate(u);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  signInWithTwitter() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithFacebook().then((res) => {
      this.dataProvider.getItemById(COLLECTION.users, res.user.uid).subscribe(u => {
        this.feedbackProvider.dismissLoading();
        this.navigate(u);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert('Login failed', 'Username an password do not match');
      }
      console.log(err);
    });
  }

  navigate(user) {
    this.feedbackProvider.presentLoading();
    this.authProvider.storeUser(user);
    forkJoin(
      this.dataProvider.getAllFromCollection(COLLECTION.users).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.jobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.appointments).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.ratings).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.appliedJobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.sharedJobs).pipe(take(1))
    ).subscribe(([users, jobs, appointments, ratings, viewedJobs, appliedJobs, sharedJobs]) => {
      this.feedbackProvider.dismissLoading();
      const data = { users, jobs, appointments, ratings, viewedJobs, appliedJobs, sharedJobs };
      this.dataProvider.updateUserData(new UserData(data));
      this.ionEvents.publish(EVENTS.loggedIn, user);
      this.navCtrl.setRoot(DashboardPage, { user });
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
