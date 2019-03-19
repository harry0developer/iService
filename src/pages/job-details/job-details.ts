import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DateProvider } from '../../providers/date/date';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { Job, AppliedJob } from '../../models/job';
import { ViewUsersPage } from '../view-users/view-users';
import { COLLECTION, EVENTS } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {
  job: any;
  postedBy: User;
  profile: any;

  hasApplied: boolean = false;

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
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.job = this.navParams.get('job');

    const jid = this.job.rid;
    this.authProvider.getFirebaseUserData(jid).subscribe(user => {
      this.postedBy = user.data();
    });

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

  isRecruiter(): boolean {
    return this.authProvider.isRecruiter();
  }

  hasUserApplied(user) {
    this.applied.map(appliedJob => {
      if (appliedJob.uid === user.id) {
        this.hasApplied = true;
      }
    })
  }

  applyNow(job) {
    this.feedbackProvider.presentLoading();
    const appliedJob: AppliedJob = {
      uid: this.profile.uid,
      jid: job.id,
      rid: this.postedBy.uid,
      dateApplied: this.dateProvider.getDate()
    }
    this.dataProvider.addNewItem(COLLECTION.appliedJobs, appliedJob).then(() => {
      this.ionEvent.publish(EVENTS.jobsUpdated);
      this.hasApplied = true;
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('Job applied successfully');
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentErrorAlert('Job application', 'Error while applying for a job');
    });
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

  withdrawApplication(job) {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCollectionByKeyValuePair(COLLECTION.appliedJobs, 'jid', job.id).subscribe((doc) => {
      const deleteJob = doc.filter(dJob => dJob.jid === job.id);
      if (deleteJob[0]) {
        this.dataProvider.removeItem(COLLECTION.appliedJobs, deleteJob[0].id).then(() => {
          this.ionEvent.publish(EVENTS.jobsUpdated);
          this.hasApplied = false;
          this.feedbackProvider.dismissLoading();
          this.feedbackProvider.presentToast('Job application cancelled successfully');
        }).catch(err => {
          this.feedbackProvider.dismissLoading();
          this.feedbackProvider.presentErrorAlert('Cancel Application', 'An error occured while cancelling job application');
        });
      }

    });
  }

  viewAppliedUsers() {
    this.navCtrl.push(ViewUsersPage, { users: this.applied });
  }
  viewViewedUsers() {
    this.navCtrl.push(ViewUsersPage, { users: this.viewed });
  }
  viewSharedUsers() {
    this.navCtrl.push(ViewUsersPage, { users: this.shared });
  }

  getSkills(skills) {
    return []; //  skills.split(',');
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

  editJob(job) {
    // this.navCtrl.push(PostJobPage, { job: job, action: 'edit' });
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
