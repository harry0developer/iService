import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { CandidatesPage } from '../pages/candidates/candidates';
import { JobsPage } from '../pages/jobs/jobs';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { DataProvider } from '../providers/data/data';
import { MyJobsPage } from '../pages/my-jobs/my-jobs';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AuthProvider } from '../providers/auth/auth';
import { ProfilePage } from '../pages/profile/profile';
import { User } from '../models/user';
import { EVENTS } from '../utils/const';

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
    private feedbackProvider: FeedbackProvider,
  ) {
    this.initializeApp();

    this.authProvider.afAuth.authState.subscribe(user => {
      this.profile = this.authProvider.getStoredUser();
    });

    this.ionEvents.subscribe(EVENTS.loggedIn, data => {
      if (data) {
        this.profile = data.user;
      }
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
    if (this.authProvider.isLoggedIn()) {
      return this.authProvider.isRecruiter();
    } else {
      this.logout();
    }
  }

  profilePicture(): string {
    return `../../assets/imgs/users/${this.profile.gender}.svg`;
  }

  logout() {
    localStorage.removeItem('user');
    this.nav.setRoot(LoginPage);
  }
}
