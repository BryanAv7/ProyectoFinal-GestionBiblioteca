import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../../../domain/prestamo';
import { Libro } from '../../../domain/libro';
import { LibroService } from '../../services/libro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderuserComponent } from '../../headeruser/headeruser.component';
import { AuthService } from '../../services/auth.service';  

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderuserComponent],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})
// Componente de Angular para gestionar préstamos de libros.
export class PrestamoComponent implements OnInit {
  // Listas y variables para gestionar préstamos, libros y estado de formularios.
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  nuevoPrestamo: Prestamo = new Prestamo();
  usuarioActual: string = '';
  fechaDevolucionInvalida: boolean = false;
  tieneLibrosPendientes: boolean = false;

  // Constructor que inyecta los servicios de libros, autenticación y router.
  constructor(
    private libroService: LibroService,
    private authService: AuthService,  
    private router: Router
  ) { }

  // Método de inicialización del componente.
  ngOnInit(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.usuarioActual = user.displayName || user.email || 'Usuario';
        this.cargarPrestamosPendientes(); // Carga préstamos pendientes del usuario.
      }
    });

    this.cargarLibros(); // Carga la lista de libros.
  }

  // Carga los préstamos pendientes del usuario actual.
  cargarPrestamosPendientes() {
    this.libroService.getPrestamosPendientes(this.usuarioActual).then(snapshot => {
      this.prestamos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
      this.tieneLibrosPendientes = this.prestamos.length > 0;

      // Muestra estado de libros pendientes durante 7 segundos.
      if (this.tieneLibrosPendientes) {
        setTimeout(() => {
          this.tieneLibrosPendientes = false;
        }, 7000);
      }
    });
  }

  // Carga la lista de libros y ajusta el estado si no está definido.
  cargarLibros() {
    this.libroService.getLibros().then(snapshot => {
      this.libros = snapshot.docs.map(doc => {
        const libro = { id: doc.id, ...doc.data() } as Libro;
        if (!libro.estado) {
          libro.estado = 'disponible';
        }
        return libro;
      });
    });
  }

  // Registra un nuevo préstamo y actualiza las listas.
  registrarPrestamo() {
    this.nuevoPrestamo.usuarioId = this.usuarioActual;
    this.libroService.addPrestamo(this.nuevoPrestamo).then(() => {
      this.cargarPrestamosPendientes();
      this.cargarLibros();
      this.limpiarCampos();
    });
  }

  // Registra la devolución de un libro y actualiza las listas.
  devolverLibro(prestamo: Prestamo) {
    this.libroService.registrarDevolucion(prestamo.id).then(() => {
      this.cargarPrestamosPendientes();
      this.cargarLibros();
    });
  }

  // Obtiene el título de un libro dado su ID.
  getLibroTitulo(libroId: string): string {
    const libro = this.libros.find(l => l.id === libroId);
    return libro ? libro.titulo : 'Desconocido';
  }

  // Limpia los campos del formulario de préstamo.
  limpiarCampos() {
    this.nuevoPrestamo = new Prestamo();
  }

  // Navega de vuelta a la vista de biblioteca.
  regresar() {
    this.router.navigate(['/biblioteca']);
  }

  // Valida que la fecha de devolución no sea anterior a la fecha de préstamo.
  validarFechas() {
    if (this.nuevoPrestamo.fechaPrestamo && this.nuevoPrestamo.fechaDevolucion) {
      const fechaPrestamo = new Date(this.nuevoPrestamo.fechaPrestamo);
      const fechaDevolucion = new Date(this.nuevoPrestamo.fechaDevolucion);
      this.fechaDevolucionInvalida = fechaDevolucion < fechaPrestamo;
    }
  }

  // Método redundante que también navega a la vista de biblioteca.
  volver() {
    this.router.navigate(['/biblioteca']);
  }
}
