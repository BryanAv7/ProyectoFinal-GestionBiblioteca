import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { LibroService } from '../../services/libro.service';
import { Prestamo } from '../../../domain/prestamo';
import { Libro } from '../../../domain/libro';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit {
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  
  constructor(private libroService: LibroService) { }

  ngOnInit(): void {
      this.cargarHistorial();
      this.cargarLibros();
  }

  cargarHistorial() {
      this.libroService.getPrestamos().then(snapshot => {
          this.prestamos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
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
}

