import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { DateProvider } from '../../providers/date/date';
import { JobDetailsPage } from '../job-details/job-details';
import { COLLECTION } from '../../utils/const';
import { Job } from '../../models/job';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
  animations: [bounceIn]
})
export class JobsPage {

  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  jobs: Job[] = [];
  tempJobs: any = [];
  location: Location;
  profile: User;
  postedBy: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private dateProvider: DateProvider,
    private feedbackProvider: FeedbackProvider,
  ) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.dataProvider.userData$.subscribe(data => {
      console.log(data);

      const loc = {
        lat: 19.999,
        lng: -29.000
      }
      this.jobs = this.dataProvider.applyHaversine(data.jobs, loc.lat, loc.lng);
    });
  }

  getDateFromNow(date: string): string {
    return this.dateProvider.getDateFromNow(date);
  }



  setFilteredJobs() {
    // this.location = this.dataProvider.getLocation();
    // this.jobs = this.dataProvider.filterJobs(this.searchTerm);

    // if (this.location && this.location.lat && this.location.lng) {
    //   this.jobs = this.dataProvider.applyHaversine(this.jobs, this.location.lat, this.location.lng);
    // }
    // this.tempJobs = this.jobs;
  }

  onSearchInput() {
    this.searching = true;
  }

  getDateTime(date) {
    return this.dateProvider.getDateFromNow(date);
  }

  jobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, page: 'jobs' });
  }

  doRefresh(refresher) {
    // this.dataProvider.initializeData();
    // this.tempJobs = this.jobs;
    // refresher.complete();
  }

  filterJobs() {
    // let modal = this.modalCtrl.create(FilterPage);

    // modal.onDidDismiss(filter => {
    //   const jobz = this.dataProvider.getJobs();
    //   this.dataProvider.sortByDistance(jobz);
    //   if (filter && filter !== 'all') {
    //     const j = jobz.filter(job => job.category.toLowerCase() === filter.toLowerCase());
    //     this.jobs = this.dataProvider.sortByDistance(j);
    //   } else {
    //     this.jobs = this.dataProvider.sortByDistance(jobz);
    //   }
    // });
    // modal.present();
  }

}
