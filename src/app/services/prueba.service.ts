import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PruebaService {

  baseUrl: string = "http://localhost:8080/proyecto/api";

  constructor(private http:HttpClient) { }

  pruebaServicio() {
    return this.http.get(`${this.baseUrl}/biblioteca`);
  }

}
