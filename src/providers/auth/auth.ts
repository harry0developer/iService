import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { User } from '../../models/user';
import { DateProvider } from '../date/date';

@Injectable()
export class AuthProvider {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public dateProvider: DateProvider
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }


  signInWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(user: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res => {
      this.updateUser(user);
    });
  }

  updateUser(data: User) {
    const user = this.afAuth.auth.currentUser;
    const userData: User = {
      uid: user.uid,
      email: user.email,
      firstname: data.firstname,
      lastname: data.lastname,
      createdAt: this.dateProvider.getDate(),
      type: data.type,
      location: data.location,
      phone: data.phone
    };
    this.storeUser(user);
    return this.afs.collection('users').doc(user.uid).set(userData);
  }

  getFirebaseUserData(uid): any {
    return this.afs.collection('users').doc(uid).get();
  }

  storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user.uid));
  }

  getStoredUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  signOut() {
    localStorage.removeItem('user');
    return this.afAuth.auth.signOut();
  }

}
