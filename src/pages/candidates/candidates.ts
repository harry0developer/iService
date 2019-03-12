import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { bounceIn } from '../../utils/animations';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';
import { UserDetailsPage } from '../user-details/user-details';
// import { PostJobPage } from '../post-job/post-job';
// import { bounceIn } from '../../util/animations';
// import 'rxjs/add/operator/debounceTime.js';
// import { Profile } from '../../models/Profile';
// import { Location } from '../../models/location';
// import { Rating, Rate } from '../../models/Ratings';
// import { UserDetailsPage } from '../user-details/user-details';

@IonicPage()
@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html',
  animations: [bounceIn]
})
export class CandidatesPage {
  searchControl: FormControl;
  searching: any = false;
  activeCategory: string = 'All';
  categories: any = [];
  profile: any;
  candidates: any[];
  // location: Location;
  // ratings: Rate;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private feedbackProvider: FeedbackProvider,
    private events: Events,
    public modalCtrl: ModalController

  ) {
    this.searchControl = new FormControl();
    this.getCategories();
  }


  ionViewWillEnter() {
    if (this.authProvider.isLoggedIn()) {
      this.authProvider.getFirebaseUserData(this.authProvider.getStoredUser().uid).subscribe(user => {
        this.profile = user.data();
      });
      this.dataProvider.getCollectionByKeyValuePair(this.dataProvider.USERS_COLLECTION, 'type', this.dataProvider.CANDIDATE_TYPE).subscribe(users => {
        const loc = {
          lat: 19.999,
          lng: -19.000
        }
        this.candidates = this.dataProvider.applyHaversine(users, loc.lat, loc.lng);;
        console.log(this.candidates);
      });
    } else {
      this.authProvider.logout();
    }
  }

  profilePicture(user): string {
    return `../../assets/imgs/users/${user.gender}.svg`;
  }

  setFilteredCandidates() {
    // let candidates = [];
    // this.location = this.dataProvider.getLocation();
    // candidates = this.dataProvider.filterCandidates(this.searchTerm);

    // if (this.location && this.location.lat && this.location.lng) {
    //   candidates = this.dataProvider.applyHaversine(this.candidates, this.location.lat, this.location.lng);
    // }
    // this.candidates = this.setCandidatesRating(candidates);
    // this.tmpCandidates = this.candidates;
  }

  viewUserDetails(candidate) {
    this.navCtrl.push(UserDetailsPage, { user: candidate });
  }

  onSearchInput() {
    this.searching = true;
  }

  filterCandidates(category) {
    // this.activeCategory = category.name;
    // if (category.name.toLowerCase() === 'all') {
    //   this.candidates = this.tmpCandidates;
    // } else {
    //   this.candidates = this.tmpCandidates || [];
    //   this.candidates = this.candidates.filter(candidate => candidate.title.toLowerCase() === category.name.toLowerCase());
    // }
  }

  setCandidatesRating(candidates) {
    // for (let i = 0; i < candidates.length; i++) {
    //   candidates[i].ratings = this.dataProvider.getMyRatingsData(candidates[i].user_id);
    // }
    // return candidates;
  }

  doRefresh(refresher) {
    // this.dataProvider.initializeData();
    refresher.complete();
  }


  postJob() {
    // let profileModal = this.modalCtrl.create(PostJobPage, { action: 'post' });
    // profileModal.onDidDismiss(data => {
    //   if (data) {
    //     this.events.publish(this.dataProvider.JOBS_UPDATED, data);
    //     this.feedbackProvider.presentAlert("Your post was successful", "To manage your posts, go to 'My Jobs' on the side menu navigation")
    //   } else {
    //     console.log("Clear filter");
    //   }
    // });
    // profileModal.present();
  }

  getCategories() {
    // this.dataProvider.getCategories().then(res => {
    //   this.categories = res;
    // }).catch(err => {
    //   console.log(err);
    // });
  }


  getDefaultProfilePic(profile) {
    // return `${this.dataProvider.getMediaUrl()}${profile.gender}.svg`;
  }

}
