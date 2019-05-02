import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController, ActionSheetController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { JobDetailsPage } from '../job-details/job-details';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { DateProvider } from '../../providers/date/date';
import { ViewedJob } from '../../models/job';

@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
  animations: [bounceIn]
})
export class MyJobsPage {
  profile: any;
  jobs: any = [];
  viewedJobs: ViewedJob[] = [];

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
    this.dataProvider.userData$.subscribe(data => {
      this.jobs = data.jobs.filter(job => job.uid === this.profile.uid);
      this.viewedJobs = data.viewedJobs;
    });
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  getDateCreated(date): string {
    return this.dateProvider.getDateFromNow(date);
  }

  getUsersViewed(job): number {
    let views = 0;
    this.viewedJobs.forEach(vjob => {
      if (vjob.jid === job.id) {
        views++;
      }
    });
    return views;
  }

  jobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job });
  }
}
