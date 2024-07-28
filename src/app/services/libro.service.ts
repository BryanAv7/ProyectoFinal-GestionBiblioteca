import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Libro } from '../../domain/libro';
import { Prestamo } from '../../domain/prestamo';

const PATH = 'libros';
const PATH_LIBROS = 'libros';
const PATH_PRESTAMOS = 'prestamos';

@Injectable({
  providedIn: 'root'
})

export class LibroService {
  constructor(private firestore: Firestore) { }

  getLibros(): Promise<any> {
    return getDocs(query(collection(this.firestore, PATH_LIBROS)));
  }

  addLibro(libro: Libro): Promise<void> {
    return addDoc(collection(this.firestore, PATH_LIBROS), Object.assign({}, libro)).then(() => {});
  }

  async getLibro(id: string): Promise<Libro | undefined> {
    try {
      const snapshot = await getDoc(doc(this.firestore, `${PATH_LIBROS}/${id}`));
      return snapshot.data() as Libro;
    } catch (error) {
      return undefined;
    }
  }

  async searchLibroByQuery(name: string): Promise<any> {
    return getDocs(query(
      collection(this.firestore, PATH_LIBROS),
      where('titulo', '>=', name),
      where('titulo', '<=', name + '\uf8ff')
    ));
  }

  updateLibro(id: string, libro: Partial<Libro>): Promise<void> {
    return updateDoc(doc(this.firestore, `${PATH_LIBROS}/${id}`), { ...libro });
  }

  deleteLibro(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${PATH_LIBROS}/${id}`));
  }

  getPrestamos(): Promise<any> {
    return getDocs(query(collection(this.firestore, PATH_PRESTAMOS)));
  }

  addPrestamo(prestamo: Prestamo): Promise<void> {
    return addDoc(collection(this.firestore, PATH_PRESTAMOS), Object.assign({}, prestamo)).then(() => {});
  }

  registrarDevolucion(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, `${PATH_PRESTAMOS}/${id}`), { estado: 'devuelto' });
  }
}