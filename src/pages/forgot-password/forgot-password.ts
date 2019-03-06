import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';
import { OtpPage } from '../otp/otp';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  data = {
    email: '',
    otp: 0
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private feedbackProvider: FeedbackProvider,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider
  ) {
  }

  confirmEmailAndSentOtp() {
    console.log(' confirmEmailAndSentOtp');

  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }
}
