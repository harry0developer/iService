import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { RatingModule } from "ngx-rating";
import { Network } from '@ionic-native/network';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { firebaseConfig } from '../config';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { OtpPage } from '../pages/otp/otp';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { MyApp } from './app.component';
import { JobsPage } from '../pages/jobs/jobs';
import { CandidatesPage } from '../pages/candidates/candidates';
import { DateProvider } from '../providers/date/date';
import { JobDetailsPage } from '../pages/job-details/job-details';
import { ProfilePage } from '../pages/profile/profile';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { MyJobsPage } from '../pages/my-jobs/my-jobs';
import { ViewedJobsPage } from '../pages/viewed-jobs/viewed-jobs';
import { ViewUsersPage } from '../pages/view-users/view-users';
import { RatingsPage } from '../pages/ratings/ratings';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { PlacesPage } from '../pages/places/places';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { SettingsPage } from '../pages/settings/settings';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { NetworkErrorPage } from '../pages/network-error/network-error';
import { NetworkProvider } from '../providers/network/network';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [
    MyApp,
    CandidatesPage,
    DashboardPage,
    ForgotPasswordPage,
    JobDetailsPage,
    JobsPage,
    LoginPage,
    OtpPage,
    ProfilePage,
    SignupPage,
    UserDetailsPage,
    MyJobsPage,
    ViewedJobsPage,
    ViewUsersPage,
    RatingsPage,
    EditProfilePage,
    PlacesPage,
    ChangePasswordPage,
    SettingsPage,
    AppointmentsPage,
    NetworkErrorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule,
    RatingModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CandidatesPage,
    DashboardPage,
    ForgotPasswordPage,
    JobDetailsPage,
    JobsPage,
    LoginPage,
    OtpPage,
    ProfilePage,
    SignupPage,
    UserDetailsPage,
    MyJobsPage,
    ViewedJobsPage,
    ViewUsersPage,
    RatingsPage,
    EditProfilePage,
    PlacesPage,
    ChangePasswordPage,
    SettingsPage,
    AppointmentsPage,
    NetworkErrorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SocialSharing,
    Network,
    DataProvider,
    AuthProvider,
    FeedbackProvider,
    DateProvider,
    NetworkProvider,
    AngularFirestore,
    AngularFireAuth
  ]
})
export class AppModule { }
