import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  otp: any = '';
  page: any;
  otpAlert: any;
  data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    dateCreated: '',
    otp: 0
  }
  emailPattern: string = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private feedbackProvider: FeedbackProvider, private dataProvider: DataProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.data = this.navParams.get('data');
    this.page = this.navParams.get('page');
    console.log(this.data);
  }

  verifyOTPCode() {
    // if (this.data.otp && this.otp && this.data.otp == this.otp) {
    //   switch (this.page) {
    //     case 'signup':
    //       this.createAccount();
    //       break;
    //     case 'forgot-password':
    //       this.navCtrl.setRoot(ResetPasswordPage, { data: this.data });
    //       break;
    //   }
    // } else {
    //   this.feedbackProvider.presentAlert('OTP Code', 'The OTP code entered does not match the one sent to your email.');
    // }
  }

  resendOTPCode(email) {

  }

  // createAccount() {
  //   const d = {
  //     firstname: this.data.firstname,
  //     lastname: this.data.lastname,
  //     email: this.data.email,
  //   }
  //   this.navCtrl.setRoot(SetupPage, { data: d });
  // }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

  presentPrompt() {
    this.otpAlert = this.alertCtrl.create({
      title: 'Resend OTP Code',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email address'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resend',
          handler: data => {
            if (data.email && data.email.match(this.emailPattern)) {
              this.resendOTPCode(data.email);
            } else {
              this.feedbackProvider.presentToast("Invalid email address");
            }
          }
        }
      ]
    });
    this.otpAlert.present();
  }
}
