import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/service/booking.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="user" class="container my-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
        <div class="card">
  <div class="card-body">
    <div *ngIf="!editMode">
      <h5 class="card-title">{{user.name}} {{user.surname}}</h5>
      <p class="card-text"><strong>Email:</strong> {{user.email}}</p>
      <div class="d-flex justify-content-between">
      <button class="btn btn-warning" (click)="enableEditMode()">Modifica</button>
      <button class="btn btn-danger" (click)="deleteUser()">Elimina Account</button>
    </div>
    </div>

    <div *ngIf="editMode">
      <div class="form-group mb-1">
        <label for="name">Nome:</label>
        <input type="text" class="form-control" id="name" [(ngModel)]="user.name" placeholder="{{user.name}}" />
      </div>
      <div class="form-group mb-1">
        <label for="surname">Cognome:</label>
        <input type="text" class="form-control" id="surname" [(ngModel)]="user.surname" placeholder="{{user.surname}}" />
      </div>
      <div class="form-group mb-2">
  <label for="email">Email:</label>
  <input type="email" class="form-control" id="email" [(ngModel)]="user.email" placeholder="{{user.email}}"
    name="email" #email="ngModel" required email />
  <div *ngIf="email.invalid && (email.dirty || email.touched)" class="text-danger">
    Inserire un indirizzo email valido.
  </div>
</div>
      <button class="btn btn-success me-1" (click)="updateUser()">Conferma</button>
      <button class="btn btn-danger" (click)="disableEditMode()">Annulla</button>
    </div>
  </div>
</div>
</div>
          <div *ngIf="openBookings.length > 0" class="m-4 row">
<div class="d-flex justify-content-center align-items-center">
            <h5>Prenotazioni Aperte:</h5>
            <button type="button" class="btn btn-success fs-5 ms-3" [routerLink]="['/checkout']">Acquista</button></div>
            <div *ngFor="let booking of openBookings; let i = index" class="col-12 col-md-3 my-2">
              <div class="card">
            <div class="card-header">Nome modello: {{booking.nomeModello}}
          </div>
              <ul *ngIf="!modificaForm[i]" class="list-group list-group-flush">
                <li class="list-group-item">Inizio: {{booking.dataInizio}}</li>
                <li class="list-group-item">Fine: {{booking.dataFine}}</li>
                <li class="list-group-item">Costo totale: {{booking.costoTotale}}€</li>
                <li class="list-group-item d-flex justify-content-between">
                  <a *ngIf="!formAperto" class="text-warning" (click)="toggleModificationForm(i, booking);">Modifica</a>
                  <a *ngIf="!formAperto" class="text-danger" (click)="deleteBooking(booking.id);">Cancella</a>
                </li>
              </ul>

              <div *ngIf="modificaForm[i]" class="p-2">
                <div class="form-group mx-1 mx-md-4 my-3">
                  <label class="text-primary" for="dataInizio">Data di Inizio</label>
                  <input
                    type="date"
                    class="form-control"
                    id="dataInizio"
                    [(ngModel)]="updatedBooking.dataInizio"
                    name="dataInizio"
                    required
                  />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-3">
                  <label class="text-primary" for="dataFine">Data di Fine</label>
                  <input
                    type="date"
                    class="form-control"
                    id="dataFine"
                    [(ngModel)]="updatedBooking.dataFine"
                    name="dataFine"
                    required
                  />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-2">
                  <button type="button" class="btn btn-danger me-3" (click)="annullaModifica(i)">Annulla</button>
                  <button class="btn btn-success" (click)="modifyBooking(booking.id)">Conferma</button>
                </div>
              </div>
</div>
            </div>
          </div>
<hr>
          <div *ngIf="closedBookings.length > 0" class="m-4 row">
            <h5 class="text-center">Prenotazioni Chiuse:</h5>
            <div *ngFor="let booking of closedBookings" class="col-12 col-md-3 mt-2">
              <div class="card">
            <div class="card-header">Nome modello: {{booking.nomeModello}}
          </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Inizio: {{booking.dataInizio}}</li>
                <li class="list-group-item">Fine: {{booking.dataFine}}</li>
                <li class="list-group-item">Costo totale: {{booking.costoTotale}}€</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>

  `,
  styles: [
    `
      .card-title {
        text-align: center;
        color: #007bff;
      }
    `
  ]
})
export class ProfileComponent implements OnInit {
  user: any;
  openBookings: any[] = [];
  closedBookings: any[] = [];
  modificaForm: boolean[] = [];
  formAperto: boolean = false;
  updatedBooking: any = {};
  editMode: boolean = false;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private router : Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.user = user;
        this.userService.getUserOpenBookings().subscribe(
          bookings => this.openBookings = bookings
        );
        this.userService.getUserClosedBookings().subscribe(
          bookings => this.closedBookings = bookings
        );
      },
      error => console.error('Error loading user profile', error)
    );
  }

  modifyBooking(id: string): void {
    const existingBooking = this.openBookings.find(b => b.id === id);
    if(!existingBooking) {
      console.error('Booking not found');
      return;
    }

    const updatedBooking = {
      dataInizio: this.updatedBooking.dataInizio || existingBooking.dataInizio,
      dataFine: this.updatedBooking.dataFine || existingBooking.dataFine,
      carId: existingBooking.carId || null
    };

    this.bookingService.updateBooking(id, updatedBooking).subscribe(
      updated => {
        console.log('Booking modified successfully!', updated);
        const index = this.openBookings.findIndex(b => b.id === id);
        if (index > -1) this.openBookings[index] = updated;
        this.modificaForm[index] = false;
        this.formAperto = false;
      },
      error => console.error('Error modifying booking', error)
    );
  }


  deleteBooking(id: string): void {
    this.bookingService.deleteBooking(id).subscribe(
      () => {
        console.log('Booking deleted successfully!');
        this.openBookings = this.openBookings.filter(booking => booking.id !== id);
      },
      error => console.error('Error deleting booking', error)
    );
  }

  annullaModifica(index: number): void {
    console.log('Operazione annullata');
    this.modificaForm[index] = false;
    this.formAperto = false;
    this.updatedBooking = {};
  }

  toggleModificationForm(index: number, booking: any): void {
    this.modificaForm[index] = !this.modificaForm[index];
    this.formAperto = this.modificaForm[index];
    if (this.modificaForm[index]) this.updatedBooking = { ...booking };
  }

  enableEditMode() {
    this.editMode = true;
  }

  disableEditMode() {
    this.editMode = false;
  }

  updateUser() {
    if (!this.user.email || !this.validateEmail(this.user.email)) {
      alert('Per favore inserisci un indirizzo email valido.');
      return;
    }

    this.userService.updateCurrentUser(this.user)
      .subscribe(
        updatedUser => {
          this.user = updatedUser;
          this.disableEditMode();
        },
        error => console.error('Error updating user', error)
      );
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  deleteUser(): void {
    if (confirm("Sei sicuro di voler eliminare il tuo profilo?")) {
      this.userService.deleteCurrentUser().subscribe(
        () => {
          console.log("Utente eliminato con successo");
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login'])
          });
        },
        error => console.error('Errore durante l\'eliminazione dell\'utente', error)
      );
    }
  }
}
