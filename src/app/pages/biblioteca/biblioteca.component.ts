import { Component } from '@angular/core';
import { Libro } from '../../../domain/libro';
import { LibroService } from '../../services/libro.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderuserComponent } from "../../headeruser/headeruser.component";



@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [FormsModule, HeaderComponent, CommonModule, HeaderuserComponent],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.scss'
})
// Componente de Angular para la gestión y filtrado de libros en la biblioteca.
export class BibliotecaComponent implements OnInit {
  // Variables para almacenar el usuario, libros y filtros de búsqueda.
  user: any;
  libros: any[] = [];
  librosFiltrados: any[] = [];
  buscaTitulo: string = '';
  buscaAutor: string = '';
  filtroCategoria: string = '';
  filtroDisponibilidad: string = '';
  categorias: string[] = ['Drama', 'Terror', 'Acción', 'Autoayuda', 'Tecnología', 'Ciencia ficción'];

  // Constructor que inyecta el servicio de libros y el router.
  constructor(private router: Router, private libroService: LibroService) { }

  // Método de inicialización del componente.
  ngOnInit() {
    this.loadLibros(); // Carga los libros disponibles al inicializar el componente.
  }

  // Carga la lista de libros desde el servicio y los guarda en el estado del componente.
  async loadLibros() {
    try {
      const data = await this.libroService.getLibros();
      this.libros = data.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
      this.librosFiltrados = [...this.libros]; // Inicializa los libros filtrados con la lista completa.
    } catch (error) {
      console.error(error); // Manejo de errores en la carga de libros.
    }
  }

  // Filtra los libros según los criterios de búsqueda y filtros.
  filterLibros() {
    this.librosFiltrados = this.libros.filter(libro => {
      const tituloCoincide = this.buscaTitulo ? libro.titulo.toLowerCase().includes(this.buscaTitulo.toLowerCase()) : true;
      const autorCoincide = this.buscaAutor ? libro.autores.toLowerCase().includes(this.buscaAutor.toLowerCase()) : true;
      const categoriaCoincide = this.filtroCategoria ? libro.categoria === this.filtroCategoria : true;
      const disponibilidadCoincide = this.filtroDisponibilidad ? libro.estado === this.filtroDisponibilidad : true;

      return tituloCoincide && autorCoincide && categoriaCoincide && disponibilidadCoincide;
    });
  }

  // Limpia todos los filtros y muestra la lista completa de libros.
  clearFilters() {
    this.buscaTitulo = '';
    this.buscaAutor = '';
    this.filtroCategoria = '';
    this.filtroDisponibilidad = '';
    this.librosFiltrados = [...this.libros];
  }

  // Actualiza los libros filtrados según los criterios de búsqueda actuales.
  changeQuery() {
    this.filterLibros();
  }

  // Navega a la vista de biblioteca (método redundante).
  volver() {
    this.router.navigate(['/biblioteca']);
  }

  // Navega a la vista de inicio de sesión.
  irLogin() {
    this.router.navigate(['/login']);
  }

  // Navega a la vista de registro.
  irRegistro() {
    this.router.navigate(['/registro']);
  }

  // Navega a la vista de préstamos para reservar libros.
  reservar() {
    this.router.navigate(['/prestamos']);
  }
}
