import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, distinct } from 'rxjs/operators';
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

  profile: User;
  KM: number = 1.60934;

  private userDataSubject = new BehaviorSubject<UserData>(null);
  userData$ = this.userDataSubject.asObservable();

  // private jobsSubject = new BehaviorSubject<Job[]>(null);
  // jobs$ = this.jobsSubject.asObservable();

  // private usersSubject = new BehaviorSubject<User[]>(null);
  // users$ = this.usersSubject.asObservable();

  userData: UserData = new UserData();

  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFirestore,
    private authProvider: AuthProvider) {
    // { users, jobs, appointments, ratings, viewedJobs, appliedJobs, sharedJobs };
    this.profile = this.authProvider.getStoredUser();

    if (this.profile) {

      let type = this.profile.type === USER_TYPE.recruiter ? 'rid' : 'uid';

      this.getUsers().subscribe(users => {
        this.userData.setUsers(users);
        this.updateUserData(this.userData);
      });

      this.getJobs().subscribe(jobs => {
        this.userData.setJobs(jobs);
        this.updateUserData(this.userData);
      });

      this.getMyAppointments(type, this.profile.uid).subscribe(appointments => {
        this.userData.setAppointments(appointments);
        this.updateUserData(this.userData);
      });

      this.getMyViewedJobs(type, this.profile.uid).subscribe(jobs => {
        this.userData.setViewedJobs(jobs);
        this.updateUserData(this.userData);
      });

      this.getMyAppliedJobs(type, this.profile.uid).subscribe(jobs => {
        this.userData.setAppliedJob(jobs);
        this.updateUserData(this.userData);
      });

      this.getMySharedJobs(type, this.profile.uid).subscribe(jobs => {
        this.userData.setSharedJobs(jobs);
        this.updateUserData(this.userData);
      });
    }
  }

  updateUserData(userData: UserData) {
    this.userData = new UserData(userData);
    this.userDataSubject.next(userData);
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

  getMappedCandidates(users, toBeMappedUsers): User[] {
    const candidates: User[] = [];
    users.map(user => {
      toBeMappedUsers.map(mUser => {
        if (user.uid === mUser.uid) {
          candidates.push(user);
        }
      });
    });
    return candidates;
  }

  getMappedRecruiters(users, toBeMappedUsers): User[] {
    const recruiters: User[] = [];
    users.map(user => {
      toBeMappedUsers.map(mUser => {
        if (user.uid === mUser.rid) {
          recruiters.push(user);
        }
      });
    });
    return recruiters;
  }

  getMappedJobs(jobs: Job[], toBeMappedJobs): Job[] {
    const jobz: Job[] = [];
    jobs.map(job => {
      toBeMappedJobs.map(mJob => {
        if (job.id === mJob.jid) {
          jobz.push(job);
        }
      });
    });
    return jobz;
  }

  removeDuplicates(array, key: string) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
    });
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

  getUsersIRated(type: string, id: string): Observable<Rating[]> {
    return this.getCollectionByKeyValuePair(COLLECTION.ratings, type, id);
  }

  getUsersRatedMe(type: string, id: string): Observable<Rating[]> {
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

  getUserWithAppointmets(profile, users: User[], appointments: Appointment[]) {
    const userz = [];
    if (profile.type === USER_TYPE.recruiter) {
      users.map(user => {
        appointments.map(app => {
          if (user.uid === app.uid) {
            userz.push(Object.assign(user, { appointment: app }));
          }
        })
      });
    } else {
      users.map(user => {
        appointments.map(app => {
          if (user.uid === app.rid) {
            userz.push(Object.assign(user, { appointment: app }));
          }
        })
      });
    }
    return userz;
  }

  // mapUsers(users) {
  //   let userz = [];
  //   if (users && this.users) {
  //     users.map(u => {
  //       this.users.map(user => {
  //         if (u.uid === user.id) {
  //           userz.push(user);
  //         }
  //       });
  //     });
  //   }
  //   return userz;
  // }

  mapIRated(users, iRated: Rating[]) {
    let raters = [];
    if (iRated && users) {
      iRated.map(r => {
        users.map(user => {
          if (r.uid === user.id) {
            raters.push(user);
          }
        });
      });
    }
    return raters;
  }

  mapRatedMe(users, ratedMe: Rating[]) {
    let raters = [];
    if (ratedMe && users) {
      ratedMe.map(r => {
        users.map(user => {
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

  getUserData(user: User) {
    const userData = {
      viewedJobs: [],
      appliedJobs: [],
      sharedJobs: [],
    }
    this.userData$.subscribe(data => {
      if (user.type === USER_TYPE.recruiter) {
        userData.viewedJobs = data.viewedJobs.filter(job => job.uid === user.uid);
        userData.appliedJobs = data.appliedJobs.filter(job => job.uid === user.uid);
        userData.sharedJobs = data.sharedJobs.filter(job => job.uid === user.uid);
      } else {
        userData.viewedJobs = data.viewedJobs.filter(job => job.rid === user.uid);
        userData.appliedJobs = data.appliedJobs.filter(job => job.rid === user.uid);
        userData.sharedJobs = data.sharedJobs.filter(job => job.rid === user.uid);
      }
      return userData;
    });
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
  //   const jobs: Job[] = this.jobs.filter(job => job.uid === this.profile.uid);
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


  mapJobs(jobs, myJobs: any[]): Job[] {
    let mappedJobs: Job[] = [];
    if (myJobs && myJobs.length > 0) {
      myJobs.forEach(myJob => {
        jobs.forEach(job => {
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
