import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DateProvider } from '../../providers/date/date';
import { AuthProvider } from '../../providers/auth/auth';
import { AppliedJob, SharedJob, ViewedJob } from '../../models/job';
import { ViewUsersPage } from '../view-users/view-users';
import { COLLECTION } from '../../utils/const';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {
  job: any;
  profile: any;

  hasApplied: boolean = false;

  applied: AppliedJob[] = [];
  viewed: ViewedJob[] = [];
  shared: SharedJob[] = [];

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public dataProvider: DataProvider, public navParams: NavParams,
    private dateProvider: DateProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private socialSharing: SocialSharing,
  ) {

  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.job = this.dataProvider.getMyJobPoster(this.navParams.get('job'));

    this.viewed = this.dataProvider.viewedJobs.filter(viewed => viewed.jid === this.job.id);
    this.applied = this.dataProvider.appliedJobs.filter(viewed => viewed.jid === this.job.id);
    this.shared = this.dataProvider.sharedJobs.filter(viewed => viewed.jid === this.job.id);

    if (!this.isJobViewed()) {
      this.addJobToViewed();
    };
    this.hasUserApplied();
  }


  private addJobToViewed() {
    this.feedbackProvider.presentLoading();
    const viewedJob: ViewedJob = {
      uid: this.profile.uid,
      jid: this.job.id,
      rid: this.job.rid,
      dateViewed: this.dateProvider.getDate()
    }
    this.dataProvider.addNewItem(COLLECTION.viewedJobs, viewedJob).then(() => {
      this.dataProvider.getViewedJobs().subscribe(viewed => {
        this.viewed = viewed;
        this.feedbackProvider.dismissLoading();
      });
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
    });
  }


  applyNow(job) {
    this.feedbackProvider.presentLoading();
    const appliedJob: AppliedJob = {
      uid: this.profile.uid,
      jid: job.id,
      rid: this.job.postedBy.uid,
      dateApplied: this.dateProvider.getDate()
    }
    this.dataProvider.addNewItem(COLLECTION.appliedJobs, appliedJob).then(() => {
      this.hasApplied = true;
      this.dataProvider.getAppliedJobs().subscribe(appliedJobs => {
        this.applied = appliedJobs;
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('You have successfully applied');
      });
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Job application', 'Error while applying for a job');
    });
  }

  withdrawApplication(job) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appliedJobs, 'jid', job.id).subscribe(doc => {
      const deleteJob = doc.filter(dJob => dJob.jid === job.id);
      if (deleteJob[0]) {
        this.dataProvider.removeItem(COLLECTION.appliedJobs, deleteJob[0].id).then(() => {
          this.hasApplied = false;
          this.dataProvider.getAppliedJobs().subscribe(appliedJobs => {
            this.applied = appliedJobs;
            this.feedbackProvider.dismissLoading();
            this.feedbackProvider.presentToast('Job application cancelled successfully');
          });
        }).catch(err => {
          console.log(err);
          this.feedbackProvider.dismissLoading();
          this.feedbackProvider.presentErrorAlert('Cancel Application', 'An error occured while cancelling job application');
        });
      }

    });
  }

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter(this.profile);
  }

  hasUserApplied() {
    this.applied.map(appliedJob => {
      if (appliedJob.uid === this.profile.uid && this.job.id === appliedJob.jid) {
        this.hasApplied = true;
      }
    });
  }

  isJobViewed(): boolean {
    if (this.viewed && this.viewed.length > 0) {
      const v = this.viewed.filter(viewed => viewed.uid === this.profile.uid && viewed.jid === this.job.id);
      return v.length > 0;
    } else {
      return false;
    }
  }

  confirmCancelApplication(job) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to cancel job application',
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


  viewAppliedUsers() {
    this.navCtrl.push(ViewUsersPage, { category: 'applied', users: this.applied });
  }
  viewViewedUsers() {
    this.navCtrl.push(ViewUsersPage, { category: 'viewed', users: this.viewed });
  }
  viewSharedUsers() {
    this.navCtrl.push(ViewUsersPage, { category: 'shared', users: this.shared });
  }

  getSkills(skills) {
    return []; //  skills.split(',');
  }

  countAppliedUsers() {

  }

  addToViewedHelper() {

  }

  getDateTime(date) {
    return this.dateProvider.getDateFromNow(date);
  }

  editJob(job) {
    // this.navCtrl.push(PostJobPage, { job: job, action: 'edit' });
  }

  shareJobWithFacebook(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaFacebook(job).then(res => {
      console.log('Sharing success :)');

    }).catch(err => {
      console.log('Error shareJobWithFacebook');
    });
    return shared;
  }

  shareJobWithTwitter(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaTwitter(job).then(res => {
      console.log('Sharing success :)');

    }).catch(err => {
      console.log('Error shareJobWithTwitter');
    });
    return shared;
  }

  shareJobWithInstagram(job) {
    let shared: boolean = false;
    this.socialSharing.shareViaInstagram(job, 'img.png').then(res => {
      console.log('Sharing success :)');
    }).catch(err => {
      console.log('Error shareJobWithInstagram');
    });
    return shared;
  }


  addToSharedJobs(job, platform) {
    this.feedbackProvider.presentLoading();
    const sharedJob: SharedJob = {
      jid: job.jid,
      uid: this.profile.uid,
      rid: this.job.postedBy.uid,
      dateShared: this.dateProvider.getDate(),
      platform,
    }
    this.dataProvider.addNewItem(COLLECTION.sharedJobs, sharedJob).then(() => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Job shared successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Job share', 'An error occured while sharing a job');
    });

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

  // private _setAppliedJobs(applied: AppliedJob[]) {
  //   let aa = [];
  //   if (applied && applied.length > 0) {
  //     applied.map(a => {
  //       if (a.jid === this.job.id) {
  //         aa.push(a);
  //       }
  //     });
  //   }
  //   this.applied = aa;
  // }

  // private _setViewedJobs(viewed: ViewedJob[]) {
  //   this.viewed = [];
  //   if (viewed && viewed.length > 0) {
  //     viewed.map(v => {
  //       if (v.jid === this.job.id) {
  //         this.viewed.push(v);
  //       }
  //     });
  //   }
  // }

  // private _setSharedJobs(shared: SharedJob[]) {
  //   this.shared = [];
  //   if (shared && shared.length > 0) {
  //     shared.map(s => {
  //       if (s.jid === this.job.id) {
  //         this.shared.push(s);
  //       }
  //     });
  //   }
  // }

  // initializeJobs() {
  //   const viewed = this.dataProvider.viewedJobs;
  //   const applied = this.dataProvider.appliedJobs;
  //   const shared = this.dataProvider.sharedJobs;
  //   this._setViewedJobs(viewed);
  //   this._setAppliedJobs(applied);
  //   this._setSharedJobs(shared);
  // }

  // unsubscribeFromSocialEvents() {
  //   this.ionEvent.unsubscribe(EVENTS.facebookShare);
  //   this.ionEvent.unsubscribe(EVENTS.twitterShare);
  //   this.ionEvent.unsubscribe(EVENTS.instagramShare);
  // }

  // presentShareJobActionSheet(job) {
  //   this.feedbackProvider.shareJobActionSheet();
  //   this.ionEvent.subscribe(EVENTS.facebookShare, () => {
  //     this.unsubscribeFromSocialEvents();
  //     if (this.shareJobWithFacebook(job)) {
  //       this.addToSharedJobs(job, PLATFORM.facebook);
  //     } else {
  //       this.feedbackProvider.presentToast('Sharing job with Facebook failed, try again');
  //     }
  //   });

  //   this.ionEvent.subscribe(EVENTS.twitterShare, () => {
  //     this.unsubscribeFromSocialEvents();
  //     if (this.shareJobWithTwitter(job)) {
  //       this.addToSharedJobs(job, PLATFORM.twitter);
  //     } else {
  //       this.feedbackProvider.presentToast('Sharing job with Twitter failed, try again');
  //     }
  //   });

  //   this.ionEvent.subscribe(EVENTS.instagramShare, () => {
  //     this.unsubscribeFromSocialEvents();
  //     if (this.shareJobWithInstagram(job)) {
  //       this.addToSharedJobs(job, PLATFORM.instagram);
  //     } else {
  //       this.feedbackProvider.presentToast('Sharing job with Instagram failed, try again');
  //     }
  //   });
  // }
}
