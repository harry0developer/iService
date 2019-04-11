import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, Events, ActionSheetController, ModalController } from 'ionic-angular';
import { EVENTS } from '../../utils/const';

@Injectable()
export class FeedbackProvider {

  loadSpinner: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private events: Events,
  ) {
  }

  presentLoading(message: string = 'Please wait...') {
    this.loadSpinner = this.loadingCtrl.create({
      content: message
    });
    this.loadSpinner.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  presentAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: "btn",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentErrorAlert(title: string, msg: string = 'Something went wrong, please try again') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: "btn",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  dismissLoading() {
    this.loadSpinner.dismiss();
  }

  presentModal(page, data?) {
    const modal = this.modalCtrl.create(page, data);
    modal.present();
  }


  shareJobActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share this job',
      buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            this.events.publish(EVENTS.facebookShare);
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            this.events.publish(EVENTS.twitterShare);
          }
        },
        {
          text: 'Instagram',
          icon: 'logo-instagram',
          handler: () => {
            this.events.publish(EVENTS.instagramShare);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }


}
