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
  reportesUsuarios: { usuarioId: string, cantidad: number }[] = [];
  librosMasPrestados: { libroId: string, cantidad: number }[] = [];

  constructor(private libroService: LibroService, private router: Router) { }

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarLibros();
  }

  cargarHistorial() {
    this.libroService.getPrestamos().then(snapshot => {
      this.prestamos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
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
    const prestamoCountPorUsuario: { [usuarioId: string]: number } = {};
    this.prestamos.forEach(prestamo => {
      if (prestamoCountPorUsuario[prestamo.usuarioId]) {
        prestamoCountPorUsuario[prestamo.usuarioId]++;
      } else {
        prestamoCountPorUsuario[prestamo.usuarioId] = 1;
      }
    });

    this.reportesUsuarios = Object.keys(prestamoCountPorUsuario).map(usuarioId => ({
      usuarioId,
      cantidad: prestamoCountPorUsuario[usuarioId]
    }));

    const prestamoCountPorLibro: { [libroId: string]: number } = {};
    this.prestamos.forEach(prestamo => {
      if (prestamoCountPorLibro[prestamo.libroId]) {
        prestamoCountPorLibro[prestamo.libroId]++;
      } else {
        prestamoCountPorLibro[prestamo.libroId] = 1;
      }
    });

    this.librosMasPrestados = Object.keys(prestamoCountPorLibro).map(libroId => ({
      libroId,
      cantidad: prestamoCountPorLibro[libroId]
    })).sort((a, b) => b.cantidad - a.cantidad);
  }

  volver() {
    this.router.navigate(['/biblioteca']); 
  }
}