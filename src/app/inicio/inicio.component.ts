import { Router } from '@angular/router';
import { LibroService } from './../services/libro.service';
import { Component, OnInit } from '@angular/core';
import { PruebaService } from '../services/prueba.service';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit{
  correo = 'asistencia@bibliobajr.com'
  obras = 0
  libros: any[] = []
  listadoLibros: any[] = []

  constructor(private router: Router,private libroService: LibroService, private pruebaService: PruebaService) { }

  ngOnInit(): void {
    this.libroService.getLibros().then(data => {

      this.libros = data.docs.map((doc: any) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    })

    this.pruebaService.pruebaServicio().subscribe((libros: any) => {
      //console.log(libros);
      this.listadoLibros = libros
    });
  }

  volver() {
    this.router.navigate(['/inicio']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}
