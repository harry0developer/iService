import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { listSlideUp } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { ChangePasswordPage } from '../change-password/change-password';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  animations: [listSlideUp]
})
export class SettingsPage {
  profile: any;
  settings: any = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false,
    hide_nationality: false,
  };
  oldSettings: any = {
    hide_dob: false,
    hide_email: false,
    hide_phone: false,
    hide_nationality: false,
  };
  constructor(
    public viewCtrl: ViewController,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    const allSettings = this.dataProvider.getSettings();
    this.settings = this.getSettings(allSettings);
    this.oldSettings = {
      ...this.settings
    }
  }

  getSettings(settingz) {
    let settings;
    let newSettings;
    settingz.forEach(s => {
      if (s.user_id_fk === this.profile.user_id) {
        settings = s;
      }
    });
    if (settings && settings.hide_dob && settings.hide_email && settings.hide_phone && settings.hide_nationality) {
      newSettings = {
        hide_dob: settings.hide_dob === '1' ? true : false,
        hide_email: settings.hide_email === '1' ? true : false,
        hide_phone: settings.hide_phone === '1' ? true : false,
        hide_nationality: settings.hide_nationality === '1' ? true : false,
      }
    } else {
      newSettings = {
        hide_dob: false,
        hide_email: false,
        hide_phone: false,
        hide_nationality: false,
      };
    }
    return newSettings;
  }

  dismiss() {
    if (this.settings.hide_dob !== this.oldSettings.hide_dob ||
      this.settings.hide_email !== this.oldSettings.hide_email ||
      this.settings.hide_phone !== this.oldSettings.hide_phone ||
      this.settings.hide_nationality !== this.oldSettings.hide_nationality) {
      this.settings.changed = true;
    }
    this.viewCtrl.dismiss(this.settings);
  }

  editProfile() {
    let modal = this.modalCtrl.create(EditProfilePage, { user: this.profile });
    modal.onDidDismiss(data => {
      if (data) {
        this.profile.address = data.address;
        this.profile.phone = data.phone;
        this.updateProfile(data);
      }
    });
    modal.present();
  }

  updateProfile(data) {

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
