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
    const type = user.type === USER_TYPE.recruiter ? 'rid' : 'uid';
    forkJoin(
      this.dataProvider.getAllFromCollection(COLLECTION.jobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.appointments).pipe(take(1)),
      this.dataProvider.getMyPostedJobs(user.uid).pipe(take(1)),
      this.dataProvider.getUsersIRated('rid', user.uid).pipe(take(1)),
      this.dataProvider.getUsersRatedMe('uid', user.uid).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.viewedJobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.appliedJobs).pipe(take(1)),
      this.dataProvider.getAllFromCollection(COLLECTION.sharedJobs).pipe(take(1))

      // this.dataProvider.getJobs().pipe(take(1)),
      // this.dataProvider.getMyAppointments(type, user.uid).pipe(take(1)),
      // this.dataProvider.getMyPostedJobs(user.uid).pipe(take(1)),
      // this.dataProvider.getUsersIRated('rid', user.uid).pipe(take(1)),
      // this.dataProvider.getUsersRatedMe('uid', user.uid).pipe(take(1)),
      // this.dataProvider.getMyViewedJobs(type, user.uid).pipe(take(1)),
      // this.dataProvider.getMyAppliedJobs(type, user.uid).pipe(take(1)),
      // this.dataProvider.getMySharedJobs(type, user.uid).pipe(take(1))
    ).subscribe(([jobs, appointments, postedJobs, iRated, ratedMe, viewedJobs, appliedJobs, sharedJobs]) => {
      this.feedbackProvider.dismissLoading();
      const profile = Object.assign(user, { rating: this.dataProvider.getMyRating(ratedMe) });
      const ratings = { iRated, ratedMe };
      const data = { profile, jobs, appointments, postedJobs, ratings, viewedJobs, appliedJobs, sharedJobs };
      this.dataProvider.updateUserData(new UserData(data));
      this.ionEvents.publish(EVENTS.loggedIn, user);
      this.navCtrl.setRoot(DashboardPage, { user });
    });
    //Amazing left join

    // this.dataProvider.getUserJobsData(user).subscribe(data => {
    //   this.feedbackProvider.dismissLoading();
    //   this.dataProvider.userData = data;
    //   this.authProvider.storeUser(user);
    //   this.navCtrl.setRoot(DashboardPage);
    // });
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
