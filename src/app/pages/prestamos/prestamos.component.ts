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
export class PrestamoComponent implements OnInit {
  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  nuevoPrestamo: Prestamo = new Prestamo();
  usuarioActual: string = '';
  fechaDevolucionInvalida: boolean = false;
  tieneLibrosPendientes: boolean = false;

  constructor(
    private libroService: LibroService,
    private authService: AuthService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.usuarioActual = user.displayName || user.email || 'Usuario';
        this.cargarPrestamosPendientes();
      }
    });

    this.cargarLibros();
  }

  cargarPrestamosPendientes() {
    this.libroService.getPrestamosPendientes(this.usuarioActual).then(snapshot => {
      this.prestamos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Prestamo));
      this.tieneLibrosPendientes = this.prestamos.length > 0;

      //  7 segundos
      if (this.tieneLibrosPendientes) {
        setTimeout(() => {
          this.tieneLibrosPendientes = false;
        }, 7000);
      }
    });
  }

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

  registrarPrestamo() {
    this.nuevoPrestamo.usuarioId = this.usuarioActual;
    this.libroService.addPrestamo(this.nuevoPrestamo).then(() => {
      this.cargarPrestamosPendientes();
      this.cargarLibros();
      this.limpiarCampos();
    });
  }

  devolverLibro(prestamo: Prestamo) {
    this.libroService.registrarDevolucion(prestamo.id).then(() => {
      this.cargarPrestamosPendientes();
      this.cargarLibros();
    });
  }

  getLibroTitulo(libroId: string): string {
    const libro = this.libros.find(l => l.id === libroId);
    return libro ? libro.titulo : 'Desconocido';
  }

  limpiarCampos() {
    this.nuevoPrestamo = new Prestamo();
  }

  regresar() {
    this.router.navigate(['/biblioteca']);
  }

  validarFechas() {
    if (this.nuevoPrestamo.fechaPrestamo && this.nuevoPrestamo.fechaDevolucion) {
      const fechaPrestamo = new Date(this.nuevoPrestamo.fechaPrestamo);
      const fechaDevolucion = new Date(this.nuevoPrestamo.fechaDevolucion);
      this.fechaDevolucionInvalida = fechaDevolucion < fechaPrestamo;
    }
  }

  volver() {
    this.router.navigate(['/biblioteca']);
  }
}
