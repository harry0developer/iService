import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CandidatesPage } from '../pages/candidates/candidates';
import { JobsPage } from '../pages/jobs/jobs';
import { DataProvider } from '../providers/data/data';
import { MyJobsPage } from '../pages/my-jobs/my-jobs';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AuthProvider } from '../providers/auth/auth';
import { ProfilePage } from '../pages/profile/profile';
import { User } from '../models/user';
import { EVENTS } from '../utils/const';
import { NetworkProvider } from '../providers/network/network';
import { NetworkErrorPage } from '../pages/network-error/network-error';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  profile: User;
  rootPage: any = LoginPage;
  defaultImg: string = '';
  pages: any = {};

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public ionEvents: Events,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public networkProvider: NetworkProvider,
    public feedbackProvider: FeedbackProvider,
  ) {
    this.initializeApp();

    this.authProvider.afAuth.authState.subscribe(() => {
      this.profile = this.authProvider.getStoredUser();
    });

    this.networkProvider.isDisconnected().subscribe(conn => {
      console.log(conn);
      this.feedbackProvider.presentModal(NetworkErrorPage, null);
    });
    this.networkProvider.isConnected().subscribe(conn => {
      console.log(conn);

    });

    this.ionEvents.subscribe(EVENTS.loggedIn, user => {
      this.profile = user;
    });

    this.pages = {
      dashboardPage: DashboardPage,
      jobsPage: JobsPage,
      candidatesPage: CandidatesPage,
      myJobsPage: MyJobsPage,
      profilePage: ProfilePage
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  isRecruiter() {
    if (this.authProvider.isLoggedIn() && this.profile && this.profile.gender) {
      return this.authProvider.isRecruiter(this.profile);
    } else {
      this.logout();
    }
  }

  profilePicture(): string {
    if (this.authProvider.isLoggedIn() && this.profile) {
      return this.dataProvider.getProfilePicture(this.profile);
    }
    return '';
  }

  logout() {
    localStorage.removeItem('user');
    this.nav.setRoot(LoginPage);
  }
}
