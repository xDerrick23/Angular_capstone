import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewUserPayload } from '../interface/new-user-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenAtStartup();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:4000/auth/login', { email, password })
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            this.getCurrentUser();
            alert("Loggato con successo!");
          }
        }),
        catchError(err => {
          alert("Credenziali errate o inesistenti!");
          console.error('Login Error:', err);
          return of(null);
        })
      );
  }

  register(newUser: NewUserPayload): Observable<any> {
    return this.http.post<any>('http://localhost:4000/auth/register', newUser);
  }

  getCurrentUser(): void {
    if (!this.isLoggedIn()) {
      this.currentUserSubject.next(null);
      return;
    }

    this.http.get<any>('http://localhost:4000/users/current')
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(err => of(null))
      )
      .subscribe();
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post<any>('http://localhost:4000/auth/logout', null, { responseType: 'text' as 'json' })
      .pipe(
        tap(() => this.currentUserSubject.next(null)),
        catchError(err => {
          console.error('Logout Error:', err);
          return of(null);
        }),
        finalize(() => this.router.navigate(['']))
      );
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): String | null {
    return localStorage.getItem('token');
  }

  private checkTokenAtStartup(): void {
    const token = this.getToken();
    if (token) this.getCurrentUser();
  }
}
