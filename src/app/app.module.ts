import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { RatingModule } from "ngx-rating";


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
import { AppointmentsPage } from '../pages/appointments/appointments';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { MyJobsPage } from '../pages/my-jobs/my-jobs';
import { ViewedJobsPage } from '../pages/viewed-jobs/viewed-jobs';

@NgModule({
  declarations: [
    MyApp,
    AppointmentsPage,
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
    ViewedJobsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AppointmentsPage,
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
    ViewedJobsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    AuthProvider,
    FeedbackProvider,
    DateProvider
  ]
})
export class AppModule { }
