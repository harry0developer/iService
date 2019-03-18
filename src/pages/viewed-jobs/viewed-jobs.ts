import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { JobDetailsPage } from '../job-details/job-details';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { bounceIn } from '../../utils/animations';
import { DateProvider } from '../../providers/date/date';

@IonicPage()
@Component({
  selector: 'page-viewed-jobs',
  templateUrl: 'viewed-jobs.html',
  animations: [bounceIn]

})
export class ViewedJobsPage {

  appliedJobs = [];
  viewedJobs = [];
  sharedJobs = [];
  appointments = [];
  category: string = '';
  pageTitle: string = '';
  somethings: any = new Array(20);
  profile: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public dateProvider: DateProvider,
    public ionEvents: Events,
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.profile;
    this.category = this.navParams.get('category');
    const data = this.navParams.get('data');

    this.appliedJobs = this.dataProvider.mapJobs(data.applied);
    this.viewedJobs = this.dataProvider.mapJobs(data.viewed);
    this.sharedJobs = this.dataProvider.mapJobs(data.shared);

    this.getCategoryInfo(this.category);
  }



  countApplied(job) {
    let count = 0;
    this.appliedJobs.map(aJob => {
      if (job.id === aJob.id) {
        count++;
      }
    });
    return count;
  }

  countViewed(job) {
    let count = 0;
    this.viewedJobs.map(aJob => {
      if (job.id === aJob.id) {
        count++;
      }
    });
    return count;
  }

  countShared(job) {
    let count = 0;
    this.sharedJobs.map(aJob => {
      if (job.id === aJob.id) {
        count++;
      }
    });
    return count;
  }

  getViewedJobs(): Array<any> {
    this.category = 'viewed';
    return this.viewedJobs;
  }

  getAppliedJobs(): Array<any> {
    this.category = 'applied';
    return this.appliedJobs;
  }

  getSharedJobs(): Array<any> {
    this.category = 'shared';
    return this.sharedJobs;
  }

  getAppointments(): Array<any> {
    this.category = 'appointments';
    // this.appointments = this.dataProvider.getMyAppointments(this.profile.user_id, this.profile.type);
    return this.appointments;
  }

  getCategoryInfo(category) {
    switch (category) {
      case 'applied':
        this.pageTitle = 'My Applied Jobs';
        return this.getAppliedJobs();
      case 'viewed':
        this.pageTitle = 'My Viewed Jobs';
        return this.getViewedJobs();

      case 'shared':
        this.pageTitle = 'My Shared Jobs';
        return this.getSharedJobs();

      default:
        return [];
    }
  }

  isRecruiter() {
    return this.profile && this.profile.type === 'recruiter';
  }

  jobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, user: this.profile });
  }

  // Appointments stuff
  viewUserDetails(candidate) {
    // this.navCtrl.push(UserDetailsPage, { user: candidate, page: 'Appointments' });
  }

  profilePicture(profile): string {
    return this.dataProvider.getProfilePicture();
  }

  getDefaultProfilePic(profile) {
    // return `${this.dataProvider.getMediaUrl()}${profile.gender}.svg`;
  }

  getDate(date: string): string {
    return this.dateProvider.getDateFromNow(date);
  }

}