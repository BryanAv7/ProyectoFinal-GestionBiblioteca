import { Component, computed } from '@angular/core';
import { IconDelete } from '../../icons/delete';
import { IconEdit } from '../../icons/edit';
import { Libro } from '../../../domain/libro';
import { LibroService } from '../../services/libro.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, NgFor } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-biblioadmin',
  standalone: true,
  imports: [IconDelete, IconEdit, ReactiveFormsModule, AsyncPipe, FormsModule, HeaderComponent, NgFor],
  templateUrl: './biblioadmin.component.html',
  styleUrl: './biblioadmin.component.scss'
})
export class BiblioadminComponent implements OnInit {
  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];
  buscaTitulo: string = '';
  buscaAutor: string = '';
  filtroCategoria: string = '';
  filtroDisponibilidad: string = '';
  categorias: string[] = ['Drama', 'Terror', 'Acción', 'Autoayuda', 'Tecnología', 'Ciencia ficción'];

  constructor(private router: Router, private libroService: LibroService) { }

  ngOnInit() {
    this.loadLibros();
  }

  async loadLibros() {
    try {
      const data = await this.libroService.getLibros();
      this.libros = data.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
      this.librosFiltrados = [...this.libros];
    } catch (error) {
      console.error(error);
    }
  }

  filterLibros() {
    this.librosFiltrados = this.libros.filter(libro => {
      const tituloCoincide = this.buscaTitulo ? libro.titulo.toLowerCase().includes(this.buscaTitulo.toLowerCase()) : true;
      const autorCoincide = this.buscaAutor ? libro.autores.toLowerCase().includes(this.buscaAutor.toLowerCase()) : true;
      const categoriaCoincide = this.filtroCategoria ? libro.categoria === this.filtroCategoria : true;
      const disponibilidadCoincide = this.filtroDisponibilidad ? libro.estado === this.filtroDisponibilidad : true;

      return tituloCoincide && autorCoincide && categoriaCoincide && disponibilidadCoincide;
    });
  }

  clearFilters() {
    this.buscaTitulo = '';
    this.buscaAutor = '';
    this.filtroCategoria = '';
    this.filtroDisponibilidad = '';
    this.librosFiltrados = [...this.libros];
  }

  changeQuery() {
    this.filterLibros();
  }

  volver() {
    this.router.navigate(['/biblioadmin']);
  }

  editLibro(libro: Libro) {
    this.router.navigate(['/editalibro', libro.id]);
  }

  async deleteLibro(id: string) {
    try {
      await this.libroService.deleteLibro(id);
      this.loadLibros(); // Actualizar la lista de libros después de eliminar
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  }
}