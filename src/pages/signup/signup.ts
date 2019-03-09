import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { EMAIL_EXISTS } from '../../config';
import { DateProvider } from '../../providers/date/date';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    type: ''
  }

  type = 'password';
  showPass = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public dateProvider: DateProvider,
    public feedbackProvider: FeedbackProvider) { }

  ionViewDidLoad() { }

  signupWithEmailAndPassword() {

    const data = {
      ...this.data,
      createdAt: this.dateProvider.getDate()
    }
    this.authProvider.signUpWithEmailAndPassword(data).then(() => {
      this.navCtrl.setRoot(DashboardPage);
    }).catch(err => {
      if (err.code === EMAIL_EXISTS) {
        this.feedbackProvider.presentErrorAlert('Signup failed', 'Email already exists, please signin');
      }
      console.log(err);
    });
  }

  sendOtpCode() {
    this.authProvider.sendVerificationMail().then(res => {
      console.log(res);

      this.navCtrl.setRoot(OtpPage);
    }).catch(err => {
      console.log(err);
    });
    // this.authProvider.sendVerificationMail().then(res => {
    //   console.log(res);
    //   this.authProvider.signUpWithEmailAndPassword(this.data.email, this.data.password).then(res => {
    //     console.log(res);
    //     this.authProvider.updateUser(res.user.uid).then(res => {
    //       console.log('Signup success', res);
    //     }).catch(er => {
    //       console.log(er);
    //     })
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // }).catch(err => {
    //   console.log(err);
    // });
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
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
