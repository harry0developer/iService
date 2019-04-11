import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job, ViewedJob, SharedJob, AppliedJob } from '../../models/job';
import { User } from '../../models/user';
import { Rating, RatingData } from '../../models/rating';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { AuthProvider } from '../auth/auth';
import { UserData } from '../../models/data';
import { leftJoin } from '../../utils/leftJoin';


@Injectable()
export class DataProvider {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<Job | User>;
  data$: Observable<Job[] | User[] | Appointment[] | AppliedJob[]>;
  userData: any;
  jobs: Job[] = [];
  postedJobs: Job[] = [];
  users: User[] = [];
  iRated: Rating[] = [];
  ratedMe: Rating[] = [];
  appointments: Appointment[] = [];
  appliedJobs: AppliedJob[] = [];
  viewedJobs: ViewedJob[] = [];
  sharedJobs: SharedJob[] = [];
  candidates: User[] = [];
  ratings: RatingData[] = [];
  userId: string;

  KM: number = 1.60934;
  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFirestore,
    private authProvider: AuthProvider) { }

  // getUserJobsData(user) {
  //   let type = user.type === USER_TYPE.recruiter ? 'rid' : 'uid';
  //   const user$ = this.getCollectionByKeyValuePair(COLLECTION.users, 'uid', user.uid);
  //   const postedJobs$ = user$.pipe(leftJoin(this.afStore, 'id', type, 'jobs'));
  //   const ratings$ = postedJobs$.pipe(leftJoin(this.afStore, 'id', type, 'ratings'));
  //   const viewed$ = ratings$.pipe(leftJoin(this.afStore, 'id', type, 'viewed-jobs'));
  //   const applied$ = viewed$.pipe(leftJoin(this.afStore, 'id', type, 'applied-jobs'));
  //   const shared$ = applied$.pipe(leftJoin(this.afStore, 'id', type, 'shared-jobs'));
  //   return shared$.pipe(leftJoin(this.afStore, 'id', type, 'appointments'));
  // }

  init(userData) {
    this.userData = userData;
    if (userData) {
      this.jobs = userData.jobs;
      this.postedJobs = userData.postedJobs;
      this.users = userData.users;
      this.viewedJobs = userData.viewedJobs;
      this.sharedJobs = userData.sharedJobs;
      this.appliedJobs = userData.appliedJobs;
      this.appointments = userData.appointments;
      this.iRated = userData.iRated;
      this.ratedMe = userData.ratedMe;
    }
  }

  getRecruitersWithPostedJobs() {
    const recruiters = this.getCollectionByKeyValuePair(COLLECTION.users, 'type', USER_TYPE.recruiter);
    return recruiters.pipe(leftJoin(this.afStore, 'uid', 'uid', 'jobs'));
  }

  getJobsWithViewedJobsData(jobs$: Observable<Job>) {
    return jobs$.pipe(leftJoin(this.afStore, 'id', 'jid', 'viewed-jobs'));
  }

  getJobsWithSharedJobsData(jobs$: Observable<Job>) {
    return jobs$.pipe(leftJoin(this.afStore, 'id', 'jid', 'shared-jobs'));
  }

  getJobsWithAppliedJobsData(jobs$: Observable<Job>) {
    return jobs$.pipe(leftJoin(this.afStore, 'id', 'jid', 'applied-jobs'));
  }

  getUsersWithAppointments(users$: Observable<User>) {
    users$.pipe(leftJoin(this.afStore, 'id', 'jid', 'applied-jobs'));
  }


  getMappedUsers(jobs, jid): any[] {
    return jobs.filter(user => jid === user.jid);
  }

  getMyJobPoster(job: Job): any {
    if (this.jobs && this.jobs.length > 0) {
      this.getUserById(job.rid).subscribe(user => {
        return Object.assign(job, { postedBy: user });
      });
    }
    return job;
  }

  getMyPostedJobs(id: string): Observable<Job[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.jobs, 'uid', id);
  }

  getJobs(): Observable<Job[]> {
    return this.getAllFromCollection(COLLECTION.jobs);
  }
  getUsers(): Observable<User[]> {
    return this.getAllFromCollection(COLLECTION.users);
  }
  getUserById(id): Observable<User> {
    return this.getItemById(COLLECTION.users, id);
  }

  getUsersIRated(type: string, id: string): Observable<Job> {
    return this.getCollectionByKeyValuePair(COLLECTION.ratings, type, id);
  }

  getUsersRatedMe(type: string, id: string): Observable<Job> {
    return this.getCollectionByKeyValuePair(COLLECTION.ratings, type, id);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.getAllFromCollection(COLLECTION.appointments);
  }
  getMyAppointments(type: string, id: string): Observable<Appointment[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.appointments, type, id);
  }

  getAppliedJobs(): Observable<AppliedJob[]> {
    return this.getAllFromCollection(COLLECTION.appliedJobs);
  }
  getMyAppliedJobs(type: string, id: string): Observable<AppliedJob[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.appliedJobs, type, id);
  }

  getViewedJobs(): Observable<ViewedJob[]> {
    return this.getAllFromCollection(COLLECTION.viewedJobs);
  }
  getMyViewedJobs(type: string, id: string): Observable<ViewedJob[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.viewedJobs, type, id);
  }

  getSharedJobs(): Observable<SharedJob[]> {
    return this.getAllFromCollection(COLLECTION.sharedJobs);
  }
  getMySharedJobs(type: string, id: string): Observable<SharedJob[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.sharedJobs, type, id);
  }

  getAllFromCollection(collectionName: string): Observable<any> {
    return this.afStore.collection<Job>(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getMyCollection(collectionName: string, uid: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCollectionByKeyValuePair(collectionName: string, key: string, value: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, ref => ref.where(key, '==', value)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getItemById(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).valueChanges();
  }

  updateItem(collectionName: string, data: User | Job | Appointment | AppliedJob | SharedJob | ViewedJob, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).set(data, { merge: true });
  }

  addNewItem(collectionName: string, data: User | Job | Appointment | AppliedJob | SharedJob | ViewedJob) {
    return this.afStore.collection(collectionName).add(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).delete();
  }

  findItemById(id: string) {
    return this.getItemById(COLLECTION.users, id);
  }

  getUserWithAppointmets(users: User[], appointments: Appointment[]) {
    const userz = [];
    console.log(users);

    users.map(user => {
      appointments.map(app => {
        if (user.uid === app.uid) {
          userz.push(Object.assign(user, { appointment: app }));
        }
      })
    })
    return userz;
  }

  mapUsers(users) {
    let userz = [];
    if (users && this.users) {
      users.map(u => {
        this.users.map(user => {
          if (u.uid === user.id) {
            userz.push(user);
          }
        });
      });
    }
    return userz;
  }

  mapIRated(iRated: Rating[]) {
    let raters = [];
    if (iRated && this.users) {
      iRated.map(r => {
        this.users.map(user => {
          if (r.uid === user.id) {
            raters.push(user);
          }
        });
      });
    }
    return raters;
  }

  mapRatedMe(ratedMe: Rating[]) {
    let raters = [];
    if (ratedMe && this.users) {
      ratedMe.map(r => {
        this.users.map(user => {
          if (r.rid === user.id) {
            raters.push(user);
          }
        });
      });
    }
    return raters;
  }

  getMyRating(ratings: Rating[]): string {
    let total = 0;
    let rate = 0;
    if (ratings) {
      ratings.forEach(rateObject => {
        total += rateObject.rating;
      });
      rate = total / ratings.length;
    }
    return rate.toFixed(1);
  }

  // getMyAppliedJobs(): AppliedJob[] {
  //   return this.appliedJobs.filter(job => job.uid === this.profile.uid);
  // }

  // getMyViewedJobs(): ViewedJob[] {
  //   return this.viewedJobs.filter(job => job.uid === this.profile.uid);
  // }

  // getMySharedJobs(): SharedJob[] {
  //   return this.sharedJobs.filter(job => job.uid === this.profile.uid);
  // }

  // getMyJobs(): Job[] {
  //   const jobs: Job[] = this.jobs.filter(job => job.rid === this.profile.uid);
  //   return jobs;
  // }

  // getMyAppointments(): Appointment[] {
  //   let appointments: Appointment[] = [];
  //   if (this.authProvider.isRecruiter()) {
  //     appointments = this.appointments.filter(appointment => appointment.rid === this.profile.uid);
  //   } else {
  //     appointments = this.appointments.filter(appointment => appointment.uid === this.profile.uid);
  //   }
  //   return appointments;
  // }

  // getMyRatings(): any {
  //   return Object.assign({}, { iRated: this.iRated, ratedMe: this.ratedMe });
  // }


  mapJobs(myJobs: any[]): Job[] {
    let mappedJobs: Job[] = [];

    if (myJobs && myJobs.length > 0) {
      myJobs.forEach(myJob => {
        this.jobs.forEach(job => {
          if (myJob.jid === job.id) {
            mappedJobs.push(job);
          }
        });
      });
    }
    return mappedJobs;
  }

  getProfilePicture(profile): string {
    return `../../assets/imgs/users/${profile.gender}.svg`;
  }

  getSettings() {
    return {};
  }

  applyHaversine(jobs, lat, lng) {
    if (jobs && lat && lng) {
      let usersLocation = {
        lat: lat,
        lng: lng
      };
      jobs.map((job) => {
        let placeLocation = {
          lat: job.location.latitude,
          lng: job.location.longitude
        };
        job.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'miles'
        ).toFixed(0);
      });
      return jobs;
    } else {
      return jobs;
    }
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d * this.KM; //convert miles to km
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
