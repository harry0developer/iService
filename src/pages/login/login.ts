import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardPage } from '../dashboard/dashboard';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { USER_NOT_FOUND } from '../../config';
import { FeedbackProvider } from '../../providers/feedback/feedback';

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
    public feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    // if (this.authProvider.isLoggedIn()) {
    //   this.navCtrl.setRoot(DashboardPage);
    // }
  }

  signinWithEmailAndPassword() {
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(() => {
      this.navCtrl.setRoot(DashboardPage);
    }).catch(err => {
      if (err.code === USER_NOT_FOUND) {
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
