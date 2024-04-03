import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg bg-white border-bottom">
      <div class="container-fluid">
        <div>
          <a class="navbar-brand text-primary m-0 fs-2" href="#">Car</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-car-front-fill mb-2 text-primary" viewBox="0 0 16 16">
            <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
          </svg>
          <a class="navbar-brand text-primary fs-2" href="#">go</a>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active text-black fs-5" aria-current="page" [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-black fs-5" [routerLink]="['/cars']" routerLinkActive="active">Veicoli</a>
            </li>
            <li *ngIf="userRole === 'ADMIN'" class="nav-item">
              <a class="nav-link text-warning fs-5" [routerLink]="['/createCar']" routerLinkActive="active">Aggiungi un veicolo</a>
            </li>
            <li *ngIf="userRole === 'ADMIN'" class="nav-item">
              <a class="nav-link text-warning fs-5" [routerLink]="['/manageBooking']" routerLinkActive="active">Gestisci prenotazioni</a>
            </li>
            <li *ngIf="userRole === 'ADMIN'" class="nav-item">
              <a class="nav-link text-warning fs-5" [routerLink]="['/managePayment']" routerLinkActive="active">Gestisci pagamenti</a>
            </li>
            <li *ngIf="userRole === 'ADMIN'" class="nav-item">
              <a class="nav-link text-warning fs-5" [routerLink]="['/manageUser']" routerLinkActive="active">Gestisci Utenti</a>
            </li>
          </ul>
        </div>

        <ng-container *ngIf="user$ | async as user; else noUser">
          <div class="d-flex align-items-center">
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary dropdown-toggle mx-2" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
</svg>
              </button>
              <ul class="dropdown-menu" aria-labelledby="profileDropdown">
                <li><a class="dropdown-item" [routerLink]="['/profile']" routerLinkActive="active">Profilo</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()">Logout</a></li>
              </ul>
              <h5 class="text-black mt-2">Ciao {{user.name}}</h5>
            </div>
          </div>
        </ng-container>

        <ng-template #noUser>
          <div class="d-flex">
            <button class="btn btn-outline-primary me-2" type="submit" [routerLink]="['/login']">Login</button>
            <button class="btn btn-outline-dark" type="submit" [routerLink]="['/register']">Register</button>
          </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [
    `.navbar-toggler.collapsed, .navbar-toggler:focus { background-color: light !important; }`
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user$: Observable<any>;
  userRole: string = '';
  private subscription: Subscription | null = null;

  constructor(private authSrv: AuthService) {
    this.user$ = this.authSrv.currentUser$;
  }

  ngOnInit(): void {
    this.subscription = this.authSrv.currentUser$.subscribe(user => {
      if (user && user.role) this.userRole = user.role;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.authSrv.logout().subscribe(
      () => {
        this.userRole = '';
      },
      error => console.error('Logout Error:', error)
    );
  }

}
