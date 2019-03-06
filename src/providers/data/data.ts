import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job } from '../../models/job';
import { User } from '../../models/user';

@Injectable()
export class DataProvider {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<Job | User>;
  data$: Observable<any[]>;

  readonly USERS_COLLECTION = 'users';
  readonly JOBS_COLLECTION = 'jobs';

  constructor(public afStore: AngularFirestore) { }


  getCollection(collectionName: string, uid?: string) {
    return this.afStore.collection<Job>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
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
    return this.afStore.collection(collectionName).doc<Job | User>(id).valueChanges();
  }

  updateItem(collectionName: string, data: User | Job, id: string) {
    console.log(collectionName);
    console.log(data);
    console.log(id);

    return this.afStore.collection(collectionName).doc<Job | User>(id).update(data);
  }

  addItem(collectionName: string, data: User | Job, id: string) {
    return this.afStore.collection(collectionName).doc<Job | User>(id).set(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<Job | User>(id).delete();
  }
}
