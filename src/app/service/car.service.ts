import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarPayload } from '../interface/car-payload';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private baseUrl = 'http://localhost:4000/cars';
  private carsSubject = new BehaviorSubject<CarPayload[]>([]);
  cars$ = this.carsSubject.asObservable();

  constructor(private http: HttpClient) { }

  refreshCars() {
    this.getAllCars().subscribe(cars => {
      this.carsSubject.next(cars);
    });
  }

  createCar(payload: CarPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, payload);
  }

  getAllCars(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getCarById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getCarsByMarca(marca: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/marca?marca=${marca}`);
  }

  getCarsByModello(modello: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/modello?modello=${modello}`);
  }

  getCarsByColore(colore: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/colore?colore=${colore}`);
  }

  getAllCarsSorted(sortBy: string, direction: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/sorted?sortBy=${sortBy}&direction=${direction}`);
  }

  updateCar(id: string, payload: CarPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
