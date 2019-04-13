import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserDetailsPage } from '../user-details/user-details';
import { DataProvider } from '../../providers/data/data';
import { DateProvider } from '../../providers/date/date';
import { AuthProvider } from '../../providers/auth/auth';
import { bounceIn } from '../../utils/animations';
import { Rating, RatingData } from '../../models/rating';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
  animations: [bounceIn]
})
export class RatingsPage {
  usersIRated: Rating[] = [];
  usersRatedMe: Rating[] = [];
  userRatings: RatingData;
  users = [];
  profile: User;
  ratings: string = 'ratedMe';

  RATED: 'rated';
  RATER: 'rater';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public dateProvider: DateProvider,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.users = this.dataProvider.users;
    this.dataProvider.userData$.subscribe(data => {
      this.dataProvider.users$.subscribe(users => {
        this.usersIRated = this.dataProvider.mapIRated(users, data.ratings.iRated);
        this.usersRatedMe = this.dataProvider.mapIRated(users, data.ratings.ratedMe);
      });
    });
  }

  getUserDetails(user) {
    this.navCtrl.push(UserDetailsPage, { user, page: 'Ratings' })
  }

  getDateRated(date): string {
    return this.dateProvider.getDateFromNow(date);
  }

  profilePicture(profile): string {
    return this.dataProvider.getProfilePicture(profile);
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}
