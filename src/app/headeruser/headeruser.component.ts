import { Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-headeruser',
  standalone: true,
  imports: [],
  templateUrl: './headeruser.component.html',
  styleUrl: './headeruser.component.scss'
})
export class HeaderuserComponent {

  usuario: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  abrirPanel() { }

  pasarNeim(name: string) {
    this.usuario = name;
  }

  irRegresar() {
    this.router.navigate(['/biblioteca']);
  }
  
  irPrestamo() {
    this.router.navigate(['/prestamos']);
  }

  async cerrarSesion() {
    try {
      await this.authService.logOut();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}