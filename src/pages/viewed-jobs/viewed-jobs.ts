import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { JobDetailsPage } from '../job-details/job-details';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { bounceIn } from '../../utils/animations';
import { DateProvider } from '../../providers/date/date';
import { EVENTS, USER_TYPE } from '../../utils/const';
import { AppliedJob, ViewedJob, SharedJob, Job } from '../../models/job';
import { Appointment } from '../../models/appointment';
import { User } from 'firebase';

@IonicPage()
@Component({
  selector: 'page-viewed-jobs',
  templateUrl: 'viewed-jobs.html',
  animations: [bounceIn]

})
export class ViewedJobsPage {

  appliedJobs: Job[] = [];
  viewedJobs: Job[] = [];
  sharedJobs: Job[] = [];
  appointments: Appointment[] = [];
  jobs: Job[] = [];
  category: string = '';
  pageTitle: string = '';
  profile: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public dateProvider: DateProvider,
    public viewCtrl: ViewController,
    public ionEvents: Events,
  ) {
  }

  ionViewDidLoad() {
    this.category = 'viewed';
    this.dataProvider.userData$.subscribe(data => {
      this.dataProvider.jobs$.subscribe(jobs => {
        this.jobs = jobs;
        this.profile = data.profile;

        if (this.profile.type === USER_TYPE.recruiter) {
          const appliedJobs = data.appliedJobs.filter(job => job.rid === this.profile.uid);
          const viewedJobs = data.viewedJobs.filter(job => job.rid === this.profile.uid);
          const sharedJobs = data.sharedJobs.filter(job => job.rid === this.profile.uid);

          this.appliedJobs = this.dataProvider.mapJobs(this.jobs, appliedJobs);
          this.viewedJobs = this.dataProvider.mapJobs(this.jobs, viewedJobs);
          this.sharedJobs = this.dataProvider.mapJobs(this.jobs, sharedJobs);
        } else {
          const appliedJobs = data.appliedJobs.filter(job => job.uid === this.profile.uid);
          const viewedJobs = data.viewedJobs.filter(job => job.uid === this.profile.uid);
          const sharedJobs = data.sharedJobs.filter(job => job.uid === this.profile.uid);

          this.appliedJobs = this.dataProvider.mapJobs(this.jobs, appliedJobs);
          this.viewedJobs = this.dataProvider.mapJobs(this.jobs, viewedJobs);
          this.sharedJobs = this.dataProvider.mapJobs(this.jobs, sharedJobs);

        }
      });
    });
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

  dismissModal() {
    this.viewCtrl.dismiss();
  }


  jobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, user: this.profile });
  }

  // Appointments stuff
  viewUserDetails(candidate) {
    // this.navCtrl.push(UserDetailsPage, { user: candidate, page: 'Appointments' });
  }

  profilePicture(profile): string {
    return this.dataProvider.getProfilePicture(profile);
  }

  getDefaultProfilePic(profile) {
    // return `${this.dataProvider.getMediaUrl()}${profile.gender}.svg`;
  }

  getDate(date: string): string {
    return this.dateProvider.getDateFromNow(date);
  }

}