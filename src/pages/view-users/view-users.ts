import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { DateProvider } from '../../providers/date/date';
import { User } from '../../models/user';
import { bounceIn } from '../../utils/animations';

@IonicPage()
@Component({
  selector: 'page-view-users',
  templateUrl: 'view-users.html',
  animations: [bounceIn]

})
export class ViewUsersPage {

  users: User[] = [];
  category: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public dateProvider: DateProvider,
  ) {
  }

  ionViewDidLoad() {
    const users = this.navParams.get('users');
    this.category = this.navParams.get('category');
    this.users = this.dataProvider.mapUsers(users);
  }

  viewUserDetails() {
  }

  getDate(user) {
    return this.dateProvider.getDateFromNow(user);
  }

  profilePicture(user): string {
    return this.dataProvider.getProfilePicture(user);
  }


}
