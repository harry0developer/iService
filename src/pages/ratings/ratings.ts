import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.users = this.dataProvider.users;
    this.userRatings = this.navParams.get('ratingsData');
    this.usersIRated = this.dataProvider.mapIRated(this.userRatings.iRated);
    this.usersRatedMe = this.dataProvider.mapRatedMe(this.userRatings.ratedMe);
  }

  mapUserIRated(): any {
    // let iRated = [];
    // this.userRatings.iRated.forEach(rater => {
    //   this.users.forEach(user => {
    //     if (this.profile.uid === rater.rater_id_fk && user.uid === rater.rated_id_fk) {
    //       iRated.push(user);
    //     }
    //   });
    // });
    // return iRated;
  }


  mapRaters(raters) {
    const users = [];
    if (raters) {
      raters.forEach(rater => {
        this.users.forEach(user => {
          if (rater.rater_id_fk === user.user_id || rater.rated_id_fk === user.user_id) {
            users.push(Object.assign(user, rater));
          }
        });
      });
    }
    return users;
  }

  getUserDetails(user) {
    this.navCtrl.push(UserDetailsPage, { user, page: 'Ratings' })
  }

  getDateRated(date): string {
    return this.dateProvider.getDateFromNow(date);
  }

  profilePicture(profile): string {
    return this.dataProvider.getProfilePicture();
  }
}
