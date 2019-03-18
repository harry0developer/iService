import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job, ViewedJob, SharedJob, AppliedJob } from '../../models/job';
import { User } from '../../models/user';
import { Rating } from '../../models/rating';
import { COLLECTION, USER_TYPE } from '../../utils/const';
import { Appointment } from '../../models/appointment';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class DataProvider {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<Job | User>;
  data$: Observable<any[]>;

  jobs: Job[];
  users: User[];
  iRated: Rating[];
  ratedMe: Rating[];
  appointments: Appointment[];
  appliedJobs: AppliedJob[];
  viewedJobs: ViewedJob[];
  sharedJobs: SharedJob[];

  KM: number = 1.60934;

  profile: User;

  constructor(public afStore: AngularFirestore, private authProvider: AuthProvider) {
    this.profile = this.authProvider.getStoredUser();
    const id = this.authProvider.isRecruiter() ? 'rid' : 'uid';

    this.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => this.jobs = jobs);
    this.getAllFromCollection(COLLECTION.users).subscribe(users => this.users = users);

    this.getCollectionByKeyValuePair(COLLECTION.appointments, id, this.profile.uid).subscribe(appointments => this.appointments = appointments);

    this.getCollectionByKeyValuePair(COLLECTION.ratings, 'rid', this.profile.uid).subscribe(ratings => this.iRated = ratings);
    this.getCollectionByKeyValuePair(COLLECTION.ratings, 'uid', this.profile.uid).subscribe(ratings => this.ratedMe = ratings);

    this.getCollectionByKeyValuePair(COLLECTION.appliedJobs, id, this.profile.uid).subscribe(appliedJobs => this.appliedJobs = appliedJobs);
    this.getCollectionByKeyValuePair(COLLECTION.viewedJobs, id, this.profile.uid).subscribe(viewedJobs => this.viewedJobs = viewedJobs);
    this.getCollectionByKeyValuePair(COLLECTION.sharedJobs, id, this.profile.uid).subscribe(sharedJobs => this.sharedJobs = sharedJobs);
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

  updateItem(collectionName: string, data: User | Job, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).update(data);
  }

  addItem(collectionName: string, data: User | Job, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).set(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).delete();
  }

  mapUsers(users) {
    let userz = [];
    users.map(u => {
      this.users.map(user => {
        if (u.uid === user.id) {
          userz.push(user);
        }
      });
    });
    return userz;
  }

  mapIRated(iRated: Rating[]) {
    let raters = [];
    iRated.map(r => {
      this.users.map(user => {
        if (r.uid === user.id) {
          raters.push(user);
        }
      });
    });
    return raters;
  }
  mapRatedMe(ratedMe: Rating[]) {
    let raters = [];
    ratedMe.map(r => {
      this.users.map(user => {
        if (r.rid === user.id) {
          raters.push(user);
        }
      });
    });
    return raters;
  }

  mapRatings(ratings: Rating[]): string {
    let total = 0;
    let rate = 0;
    ratings.forEach(rateObject => {
      total += rateObject.rating;
    });
    rate = total / ratings.length;
    return rate.toFixed(1);
  }

  getMyAppliedJobs(): AppliedJob[] {
    return this.appliedJobs;
  }

  getMyViewedJobs(): ViewedJob[] {
    return this.viewedJobs;
  }

  getMySharedJobs(): SharedJob[] {
    return this.sharedJobs;
  }

  getMyJobs(): Job[] {
    const jobs: Job[] = this.jobs.filter(job => job.rid === this.profile.uid);
    return jobs;
  }

  getMyAppointments(): Appointment[] {
    let appointments: Appointment[] = [];
    if (this.authProvider.isRecruiter()) {
      appointments = this.appointments.filter(appointment => appointment.rid === this.profile.uid);
    } else {
      appointments = this.appointments.filter(appointment => appointment.uid === this.profile.uid);
    }
    return appointments;
  }

  getMyRatings(): any {
    return Object.assign({}, { iRated: this.iRated, ratedMe: this.ratedMe });
  }



  mapJobs(myJobs: Job[]): Job[] {
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


  getUserProfile() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.getItemById(COLLECTION.users, user.uid).subscribe(u => {
      this.profile = u;
    });
  }

  getProfilePicture(): string {
    return `../../assets/imgs/users/${this.profile.gender}.svg`;
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
