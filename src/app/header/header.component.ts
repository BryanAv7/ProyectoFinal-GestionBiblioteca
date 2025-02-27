import { Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  usuario: string = ''

  constructor(private authService: AuthService, private router: Router) { }

  abrirPanel() { }

  pasarNeim(name: string) {
    this.usuario = name;
  }

  irListaUser() {
    this.router.navigate(['/listausuario']);
  }

  irBibliAdmin() {
    this.router.navigate(['/biblioadmin']);
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irCreaLibro() {
    this.router.navigate(['/crealibro']);
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
