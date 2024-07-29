import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { LibroService } from '../../services/libro.service';
import { Prestamo } from '../../../domain/prestamo';
import { Libro } from '../../../domain/libro';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NgFor, CommonModule, HeaderComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit {
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  librosDevueltos: Prestamo[] = [];
  librosNoDevueltos: Prestamo[] = [];
  librosMasPrestados: { libroId: string, cantidad: number }[] = [];

  constructor(private libroService: LibroService, private router: Router) { }

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarLibros();
  }

  cargarHistorial() {
    this.libroService.getPrestamos().then(snapshot => {
      this.prestamos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
      this.librosDevueltos = this.prestamos.filter(prestamo => prestamo.devuelto);
      this.generarReportes();
    });
  }

  cargarLibros() {
    this.libroService.getLibros().then(snapshot => {
      this.libros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Libro));
    });
  }

  getLibroTitulo(libroId: string): string {
    const libro = this.libros.find(l => l.id === libroId);
    return libro ? libro.titulo : 'Desconocido';
  }

  generarReportes() {
    this.librosNoDevueltos = this.prestamos.filter(prestamo => !prestamo.devuelto);

    const prestamoCount: { [libroId: string]: number } = {};
    this.prestamos.forEach(prestamo => {
      if (prestamoCount[prestamo.libroId]) {
        prestamoCount[prestamo.libroId]++;
      } else {
        prestamoCount[prestamo.libroId] = 1;
      }
    });

    this.librosMasPrestados = Object.keys(prestamoCount).map(libroId => ({
      libroId,
      cantidad: prestamoCount[libroId]
    })).sort((a, b) => b.cantidad - a.cantidad);
  }

  volver() {
    this.router.navigate(['/biblioteca']); 
  }
}