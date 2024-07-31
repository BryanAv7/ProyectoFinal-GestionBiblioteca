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
// Componente de Angular para mostrar el historial de préstamos y generar reportes.
export class HistorialComponent implements OnInit {
  // Listas para almacenar los préstamos, libros y reportes.
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  reportesUsuarios: { usuarioId: string, cantidad: number }[] = [];
  librosMasPrestados: { libroId: string, cantidad: number }[] = [];

  // Constructor que inyecta el servicio de libros y el router.
  constructor(private libroService: LibroService, private router: Router) { }

  // Método de inicialización del componente.
  ngOnInit(): void {
    this.cargarHistorial(); // Carga los préstamos.
    this.cargarLibros();   // Carga los libros.
  }

  // Carga el historial de préstamos y genera los reportes.
  cargarHistorial() {
    this.libroService.getPrestamos().then(snapshot => {
      this.prestamos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
      this.generarReportes(); // Genera reportes después de cargar los préstamos.
    });
  }

  // Carga la lista de libros.
  cargarLibros() {
    this.libroService.getLibros().then(snapshot => {
      this.libros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Libro));
    });
  }

  // Obtiene el título de un libro dado su ID.
  getLibroTitulo(libroId: string): string {
    const libro = this.libros.find(l => l.id === libroId);
    return libro ? libro.titulo : 'Desconocido';
  }

  // Genera reportes de préstamos por usuario y libros más prestados.
  generarReportes() {
    const prestamoCountPorUsuario: { [usuarioId: string]: number } = {};
    this.prestamos.forEach(prestamo => {
      prestamoCountPorUsuario[prestamo.usuarioId] = (prestamoCountPorUsuario[prestamo.usuarioId] || 0) + 1;
    });

    this.reportesUsuarios = Object.keys(prestamoCountPorUsuario).map(usuarioId => ({
      usuarioId,
      cantidad: prestamoCountPorUsuario[usuarioId]
    }));

    const prestamoCountPorLibro: { [libroId: string]: number } = {};
    this.prestamos.forEach(prestamo => {
      prestamoCountPorLibro[prestamo.libroId] = (prestamoCountPorLibro[prestamo.libroId] || 0) + 1;
    });

    this.librosMasPrestados = Object.keys(prestamoCountPorLibro).map(libroId => ({
      libroId,
      cantidad: prestamoCountPorLibro[libroId]
    })).sort((a, b) => b.cantidad - a.cantidad);
  }

  // Navega de vuelta a la vista de biblioteca.
  volver() {
    this.router.navigate(['/biblioteca']); 
  }
}
