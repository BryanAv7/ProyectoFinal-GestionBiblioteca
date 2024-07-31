import { Injectable } from '@angular/core';
import { Auth, AuthProvider, GoogleAuthProvider, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export interface Credential {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly authState$ = authState(this.afAuth);

  constructor(private afAuth: Auth, private firestore: Firestore) { }

  signUpWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.afAuth,
      credential.email,
      credential.password
    );
  }

  logInWithEmailAndPassword(credential: Credential) {
    return signInWithEmailAndPassword(
      this.afAuth,
      credential.email,
      credential.password
    );
  }

  logOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return this.callPopUp(provider);
  }

  async callPopUp(provider: AuthProvider): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.afAuth, provider);
      return result;
    } catch (error: any) {
      return error;
    }
  }
  async isAdmin(userId: string): Promise<boolean> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data()['isadmin'];
    } else {
      return false;
    }
  }
  getCurrentUser() {
    return this.afAuth.currentUser;
  }
}