import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, doc, setDoc, getDoc, updateDoc, where } from '@angular/fire/firestore';
import { User } from '../../domain/user';

const PATH = 'usuarios';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) { }

  getUsers() {
    return getDocs(query(collection(this.firestore, PATH)));
  }

  async addUser(user: User): Promise<void> {
    const userRef = doc(this.firestore, `${PATH}/${user.correo}`);
    return setDoc(userRef, Object.assign({}, user));
  }

  async getUser(id: string) {
    try {
      const snapshot = await getDoc(doc(this.firestore, `${PATH}/${id}`));
      return snapshot.data() as User;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return undefined;
    }
  }
  async getUserEmail(correo: string) {
    try {
      const snapshot = await getDoc(doc(this.firestore, `${PATH}/${correo}`));
      return snapshot.data() as User;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return undefined;
    }
  }

  async searchUserUnico(name: string) {
    return getDocs(query(
      collection(this.firestore, PATH),
      where('correo', '>=', name),
      where('correo', '<=', name + '\uf8ff')
    ));
  }

  async searchUserByQuery(name: string) {
    return getDocs(query(
      collection(this.firestore, PATH),
      where('user', '>=', name),
      where('user', '<=', name + '\uf8ff')
    ));
  }

  updateUser(id: string, user: User) {
    return updateDoc(doc(this.firestore, `${PATH}/${id}`), { ...user });
  }

  private document(id: string) {
    return doc(this.firestore, `${PATH}/${id}`);
  }
}