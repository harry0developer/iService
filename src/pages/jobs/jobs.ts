import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { DateProvider } from '../../providers/date/date';
import { JobDetailsPage } from '../job-details/job-details';
import { COLLECTION } from '../../utils/const';
import { Job } from '../../models/job';
import { FeedbackProvider } from '../../providers/feedback/feedback';

// import { JobDetailsPage } from '../job-details/job-details';
// import { LocationProvider } from '../../providers/location/location';
// import { FilterPage } from '../filter/filter';
// import { FeedbackProvider } from '../../providers/feedback/feedback';
// import { locateHostElement } from '@angular/core/src/render3/instructions';
// import { ConnectionProvider } from '../../providers/connection/connection';
// import { Profile } from '../../models/Profile';
// import { Location } from '../../models/location';

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
  items = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5'];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private dateProvider: DateProvider,
    private feedbackProvider: FeedbackProvider,
    private modalCtrl: ModalController,
  ) {
    this.searchControl = new FormControl();
    // this.profile = this.dataProvider.getProfile();
  }

  ionViewDidLoad() {
    this.feedbackProvider.presentLoading();
    if (this.authProvider.isLoggedIn()) {
      this.profile = this.authProvider.getStoredUser();
      this.dataProvider.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => {
        this.jobs = jobs;
        this.feedbackProvider.dismissLoading();
      });
    } else {
      this.feedbackProvider.dismissLoading();
      this.authProvider.logout();
      this.navCtrl.setRoot(LoginPage);
    }
  }

  getDateFromNow(date: string): string {
    return this.dateProvider.getDateFromNow(date);
  }


  logout() {
    this.authProvider.logout().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
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
    console.log(date);

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
