import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job } from '../../models/job';
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
  ratings: Rating[];
  appointments: Appointment[];

  KM: number = 1.60934;

  profile: User;

  constructor(public afStore: AngularFirestore, private authProvider: AuthProvider) {
    this.profile = this.authProvider.getStoredUser();
    this.getAllFromCollection(COLLECTION.jobs).subscribe(jobs => this.jobs = jobs);
    this.getAllFromCollection(COLLECTION.users).subscribe(users => this.users = users);
    this.getAllFromCollection(COLLECTION.ratings).subscribe(ratings => this.ratings = ratings);
    this.getAllFromCollection(COLLECTION.appointments).subscribe(appointments => this.appointments = appointments);
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

  // getMyRatings(user) {
  //   let rating;
  //   const id = user.type === USER_TYPE.recruiter ? 'rid' : 'uid';
  //   this.getCollectionByKeyValuePair(COLLECTION.ratings, id, this.profile.uid).subscribe(rating => {
  //     rating = this.mapRatings(rating)
  //   });
  // }
  mapRatings(ratings: Rating[]): string {
    let total = 0;
    let rate = 0;
    ratings.forEach(rateObject => {
      total += rateObject.rating;
    });
    rate = total / ratings.length;
    return rate.toFixed(1);
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

  mapJobs(myJobs: Job[]): Job[] {
    let mappedJobs: Job[] = [];
    myJobs.forEach(myJob => {
      this.jobs.forEach(job => {
        if (myJob.jid === job.jid) {
          mappedJobs.push(job);
        }
      });
    });
    return mappedJobs;
  }


  getUserProfile() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.getItemById(COLLECTION.users, user.uid).subscribe(u => {
      this.profile = u;
      console.log(u);

    });
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
