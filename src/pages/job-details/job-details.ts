import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DateProvider } from '../../providers/date/date';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Job } from '../../models/job';

@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {
  job: any;
  postedBy: User;
  profile: any;

  applied: any[] = [];
  viewed: any[] = [];
  shared: any[] = [];

  constructor(
    public navCtrl: NavController, public ionEvent: Events,
    public actionSheetCtrl: ActionSheetController,
    public dataProvider: DataProvider, public navParams: NavParams,
    private dateProvider: DateProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider) {
    this.profile = this.authProvider.getFirebaseUserData(this.authProvider.getStoredUser().uid);
  }

  ionViewDidLoad() {
    this.job = this.navParams.get('job');

    const jid = this.job.rid;
    this.authProvider.getFirebaseUserData(jid).subscribe(user => {
      this.postedBy = user.data();
    });

    // const jobs = this.dataProvider.jobs;
    // const users = this.dataProvider.users;

    const appliedJobs = this.dataProvider.appliedJobs;
    const viewedJobs = this.dataProvider.viewedJobs;
    const sharedJobs = this.dataProvider.sharedJobs;

    appliedJobs.map(a => {
      if (a.jid === this.job.id) {
        this.applied.push(a);
      }
    });

    viewedJobs.map(v => {
      if (v.jid === this.job.id) {
        this.viewed.push(v);
      }
    });

    sharedJobs.map(s => {
      if (s.jid === this.job.id) {
        this.shared.push(s);
      }
    });

  }

  getSkills(skills) {
    return []; //  skills.split(',');
  }

  applyNow(job) {

  }


  confirmWithdrawApplication(job) {
    this.presentActionSheet(job);
  }

  withdrawApplication(job) {

  }

  hasApplied(): boolean {
    return false;
  }

  countAppliedUsers() {

  }

  private hasViewedJob() {
    // this.viewedJobs = this.dataProvider.getViewedJobs();
    // if (this.viewedJobs.length > 0) {
    //   this.countJobViews(this.viewedJobs);
    //   for (let i = 0; i < this.viewedJobs.length; i++) {
    //     if (this.job.recruiter_id_fk !== this.profile.user_id && this.viewedJobs[i].job_id_fk == this.job.job_id && this.profile.user_id == this.viewedJobs[i].candidate_id_fk) {
    //       this.didView = true;
    //     }
    //   }
    //   if (!this.didView) {
    //     this.addToViewedHelper();
    //   }
    // }
    // else {
    //   this.addToViewedHelper();
    // }
  }

  addToViewedHelper() {

  }

  getDateTime(date) {
    return this.dateProvider.getDateFromNow(date);
  }

  isCandidate() {
    return false;
  }

  editJob(job) {
    // this.navCtrl.push(PostJobPage, { job: job, action: 'edit' });
  }

  presentActionSheet(job) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to cancel the application',
      buttons: [
        {
          text: 'Cancel Application',
          role: 'destructive',
          handler: () => {
            this.withdrawApplication(job);
          }
        },
        {
          text: "Don't Cancel",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }


  shareJobWithFacebook(job) {
    // let shared: boolean = false;
    // this.socialSharing.shareViaFacebook(job, "img.png", "www.job.co.za").then(res => {
    //   shared = true;
    // }).catch(err => {
    //   console.log('Error shareJobWithFacebook');
    // });
    // return shared;
  }

  shareJobWithTwitter(job) {
    // let shared: boolean = false;
    // this.socialSharing.shareViaTwitter(job, "img.png", "www.job.co.za").then(res => {
    //   shared = true;
    // }).catch(err => {
    //   console.log('Error shareJobWithTwitter');
    // });
    // return shared;
  }

  shareJobWithInstagram(job) {
    // let shared: boolean = false;
    // this.socialSharing.shareViaInstagram(job, "img.png").then(res => {
    //   shared = true;
    // }).catch(err => {
    //   console.log('Error shareJobWithInstagram');
    // });
    // return shared;
  }

  unsubscribeFromSocialEvents() {
    this.ionEvent.unsubscribe('action:facebook');
    this.ionEvent.unsubscribe('action:twitter');
    this.ionEvent.unsubscribe('action:instagram');
  }

  presentShareJobActionSheet(job) {
    // this.feedbackProvider.shareJobActionSheet();
    // this.ionEvent.subscribe('action:facebook', () => {
    //   this.unsubscribeFromSocialEvents();
    //   if (this.shareJobWithFacebook(job)) {
    //     this.addToSharedJobs(job, 'facebook');
    //   } else {
    //     this.feedbackProvider.presentToast('Sharing job with Facebook failed, try again');
    //   }
    // });

    // this.ionEvent.subscribe('action:twitter', () => {
    //   this.unsubscribeFromSocialEvents();
    //   if (this.shareJobWithTwitter(job)) {
    //     this.addToSharedJobs(job, 'twitter');
    //   } else {
    //     this.feedbackProvider.presentToast('Sharing job with Twitter failed, try again');
    //   }
    // });

    // this.ionEvent.subscribe('action:instagram', () => {
    //   this.unsubscribeFromSocialEvents();
    //   if (this.shareJobWithInstagram(job)) {
    //     this.addToSharedJobs(job, 'instagram');
    //   } else {
    //     this.feedbackProvider.presentToast('Sharing job with Instagram failed, try again');
    //   }
    // });

  }

  addToSharedJobs(job, platform) {

  }

  deleteJob(job) {

  }

  manageJob(job) {
    const actionSheet = this.actionSheetCtrl.create({
      title: `Manage: ${job.title}`,
      buttons: [
        {
          text: 'Edit Job',
          icon: 'create',
          handler: () => {
            this.editJob(job);
          }
        },
        {
          text: 'Delete Job',
          icon: 'trash',
          handler: () => {
            this.deleteJob(job);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
