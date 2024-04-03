import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:4000/payments';

  constructor(private http: HttpClient) { }

  getAllPayments(): Observable<any[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<any[]>(url);
  }

  createPayment(): Observable<any> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<any>(url, null);
  }

  getPaymentById(paymentId: string): Observable<any> {
    const url = `${this.baseUrl}/${paymentId}`;
    return this.http.get<any>(url);
  }

  deletePayment(paymentId: string): Observable<void> {
    const url = `${this.baseUrl}/${paymentId}`;
    return this.http.delete<void>(url);
  }
}
