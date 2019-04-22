import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, Events, Toggle } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { listSlideUp } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { ChangePasswordPage } from '../change-password/change-password';
import { Settings } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  animations: [listSlideUp]
})
export class SettingsPage {
  profile: any;
  settings: Settings = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false
  };
  oldSettings: Settings = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false
  };

  changed: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {
      const user = data.users.filter(user => user.uid === this.profile.uid);
      this.profile = user[0];
      this.settings = this.profile.settings;
    });
  }

  applySettings() {
    this.viewCtrl.dismiss(this.settings);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  editProfile() {
    let modal = this.modalCtrl.create(EditProfilePage, { user: this.profile });

    modal.onDidDismiss(data => {
      if (data) {
        this.updateProfile(data);
      }
    });
    modal.present();
  }

  updateProfile(data) {
    console.log(data);
  }

  applianceChange(ctl: Toggle, app): void {
    if (ctl.checked === app.state) {
      return;
    }
    console.log(ctl);


    // do further things that may or may not change app.state
  }

  changePasswordPage() {
    let modal = this.modalCtrl.create(ChangePasswordPage);
    modal.onDidDismiss(status => {
      if (status && status === 'success') {
        this.feedbackProvider.presentAlert('Password changed', 'Your password has been updated successfully');
      } else {
        console.log('no changes', status);
      }
    });
    modal.present();
  }

  openNetworkSettings() {
    // this.locationProvider.openNetworkSettings();
  }

  isLocationSet() {
    return false;
    // return this.dataProvider.getUserLocation() ? false : true;
  }


}
