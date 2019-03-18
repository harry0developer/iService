import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController, ActionSheetController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { JobDetailsPage } from '../job-details/job-details';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { DateProvider } from '../../providers/date/date';

@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
  animations: [bounceIn]
})
export class MyJobsPage {
  profile: any;
  jobs: any = [];

  constructor(
    public navCtrl: NavController,
    public navParama: NavParams,
    private dataProvider: DataProvider,
    private events: Events,
    private modalCtrl: ModalController,
    private feedbackProvider: FeedbackProvider,
    private authProvider: AuthProvider,
    private actionSheetCtrl: ActionSheetController,
    private dateProvider: DateProvider,
    private viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.jobs = this.navParama.get('jobs');
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter();
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  getDateCreated(date): string {
    return this.dateProvider.getDateFromNow(date);
  }

  jobDetails() { }

}
