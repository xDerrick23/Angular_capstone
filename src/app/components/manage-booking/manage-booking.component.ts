import { Component, OnInit } from '@angular/core';
import { BookingPayload } from 'src/app/interface/booking-payload';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-manage-booking',
  template: `
  <div id="main">
    <div *ngIf="openBookings.length > 0" class="m-4 row">
    <h5 class="text-center">Prenotazioni Aperte:</h5>
    <div *ngFor="let booking of openBookings" class="col-12 col-md-3 my-2">
        <div class="card">
            <div class="card-header">Nome modello: {{booking.nomeModello}}</div>
            <ul *ngIf="editingBookingId !== booking.id" class="list-group list-group-flush">
                <li class="list-group-item">ID prenotazione: {{booking.id}}</li>
                <li class="list-group-item">Inizio: {{booking.dataInizio}}</li>
                <li class="list-group-item">Fine: {{booking.dataFine}}</li>
                <li class="list-group-item">Costo totale: {{booking.costoTotale}}€</li>
                <li class="list-group-item d-flex justify-content-between">
                    <a *ngIf="!formAperto" class="text-warning" (click)="toggleModificationForm(booking);">Modifica</a>
                    <a *ngIf="!formAperto" class="text-danger" (click)="deleteBooking(booking.id);">Cancella</a>
                </li>
            </ul>
            <div *ngIf="editingBookingId === booking.id" class="p-2">
                <div class="form-group mx-1 mx-md-4 my-3">
                    <label class="text-primary" for="dataInizio">Data di Inizio</label>
                    <input type="date" class="form-control" id="dataInizio" [(ngModel)]="updatedBooking.dataInizio"
                        name="dataInizio" required />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-3">
                    <label class="text-primary" for="dataFine">Data di Fine</label>
                    <input type="date" class="form-control" id="dataFine" [(ngModel)]="updatedBooking.dataFine"
                        name="dataFine" required />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-2">
                    <button type="button" class="btn btn-danger me-3" (click)="annullaModifica()">Annulla</button>
                    <button class="btn btn-success" (click)="modifyBooking(booking.id)">Conferma</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div *ngIf="closedBookings.length > 0" class="m-4 row">
    <h5 class="text-center">Prenotazioni Chiuse:</h5>
    <div *ngFor="let booking of closedBookings" class="col-12 col-md-3 mt-2">
        <div class="card">
            <div class="card-header">Nome modello: {{booking.nomeModello}}</div>
            <ul *ngIf="editingBookingId !== booking.id" class="list-group list-group-flush">
                <li class="list-group-item">ID prenotazione: {{booking.id}}</li>
                <li class="list-group-item">Email acquirente: {{booking.emailAcquirente}}</li>
                <li class="list-group-item">Inizio: {{booking.dataInizio}}</li>
                <li class="list-group-item">Fine: {{booking.dataFine}}</li>
                <li class="list-group-item">Costo totale: {{booking.costoTotale}}€</li>
                <li class="list-group-item d-flex justify-content-between">
                    <a *ngIf="!formAperto" class="text-warning" (click)="toggleModificationForm(booking);">Modifica</a>
                    <a *ngIf="!formAperto" class="text-danger" (click)="deleteBooking(booking.id);">Cancella</a>
                </li>
            </ul>
            <div *ngIf="editingBookingId === booking.id" class="p-2">
                <div class="form-group mx-1 mx-md-4 my-3">
                    <label class="text-primary" for="dataInizio">Data di Inizio</label>
                    <input type="date" class="form-control" id="dataInizio" [(ngModel)]="updatedBooking.dataInizio"
                        name="dataInizio" required />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-3">
                    <label class="text-primary" for="dataFine">Data di Fine</label>
                    <input type="date" class="form-control" id="dataFine" [(ngModel)]="updatedBooking.dataFine"
                        name="dataFine" required />
                </div>
                <div class="form-group mx-1 mx-md-4 mb-2">
                    <button type="button" class="btn btn-danger me-3" (click)="annullaModifica()">Annulla</button>
                    <button class="btn btn-success" (click)="modifyBooking(booking.id)">Conferma</button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
  `,
  styles: [
    `#main{
      min-height: 60vh;
    }`
  ]
})
export class ManageBookingComponent implements OnInit {
  openBookings: any[] = [];
  closedBookings: any[] = [];
  formAperto: boolean = false;
  editingBookingId: string | null = null;
  updatedBooking: BookingPayload = {} as BookingPayload;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();

  }

  loadBookings(): void {
    this.bookingService.getOpenBookings().subscribe(
      bookings => this.openBookings = bookings,
      error => console.error('Error loading open bookings', error)
    );

    this.bookingService.getClosedBookings().subscribe(
      bookings => this.closedBookings = bookings,
      error => console.error('Error loading closed bookings', error)

    );
  }

  toggleModificationForm(booking: any): void {
    if (this.editingBookingId === booking.id) {
      this.editingBookingId = null;
      this.formAperto = false;
    } else {
      this.editingBookingId = booking.id;
      this.formAperto = true;
      this.updatedBooking = { ...booking };
    }
  }

  annullaModifica(): void {
    this.editingBookingId = null;
    this.formAperto = false;
  }

  modifyBooking(id: string): void {
    this.bookingService.updateBookingAdmin(id, this.updatedBooking).subscribe(
      () => {
        this.loadBookings();
        this.formAperto = false;
        this.editingBookingId = null;
      },
      error => console.error('Error updating booking', error)
    );
  }

  deleteBooking(id: string): void {
    this.bookingService.deleteBookingAdmin(id).subscribe(
      () => this.loadBookings(),
      error => console.error('Error deleting booking', error)
    );
  }
}
