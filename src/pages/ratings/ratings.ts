import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserDetailsPage } from '../user-details/user-details';
import { DataProvider } from '../../providers/data/data';
import { DateProvider } from '../../providers/date/date';
import { AuthProvider } from '../../providers/auth/auth';
import { bounceIn } from '../../utils/animations';
import { Rating, RatingData } from '../../models/rating';
import { User } from '../../models/user';
import { USER_TYPE } from '../../utils/const';

@IonicPage()
@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
  animations: [bounceIn]
})
export class RatingsPage {
  usersIRated: User[] = [];
  usersRatedMe: User[] = [];
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
    this.dataProvider.userData$.subscribe(data => {
      if (this.profile.type === USER_TYPE.recruiter) {
        const usersIRated = data.ratings.filter(rater => rater.rid === this.profile.uid);
        const usersRatedMe = data.ratings.filter(rater => rater.uid === this.profile.uid);
        this.usersIRated = this.dataProvider.getMappedCandidates(data.users, usersIRated);
        this.usersRatedMe = this.dataProvider.getMappedRecruiters(data.users, usersRatedMe);

      } else {
        const usersIRated = data.ratings.filter(rater => rater.rid === this.profile.uid);
        const usersRatedMe = data.ratings.filter(rater => rater.uid === this.profile.uid);
        this.usersIRated = this.dataProvider.getMappedRecruiters(data.users, usersIRated);
        this.usersRatedMe = this.dataProvider.getMappedCandidates(data.users, usersRatedMe);
      }
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
