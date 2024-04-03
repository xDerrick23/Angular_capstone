import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/service/car.service';
import { Car } from 'src/app/interface/car';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/service/booking.service';
import { BookingPayload } from 'src/app/interface/booking-payload';
import { CarPayload } from 'src/app/interface/car-payload';

@Component({
  selector: 'app-cars',
  template: `
  <div class="row">
    <div class="container-fluid px-0 col-12 col-md-10">
      <div class="bg-light px-4 py-3 align-items-center ">
        <h4 class="text-primary flex-grow-1 ms-3">Ricerca Auto</h4>
        <div class="d-flex">
          <div class="form-group mx-1 mx-md-4">
            <label class="text-primary" for="marca">Marca</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="marca"
              id="marca"
              (input)="onSearch()"
            />
          </div>
          <div class="form-group mx-1 mx-md-4">
            <label class="text-primary" for="modello">Modello</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="modello"
              id="modello"
              (input)="onSearch()"
            />
          </div>
          <div class="form-group mx-1 mx-md-4">
            <label class="text-primary" for="colore">Colore</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="colore"
              id="colore"
              (input)="onSearch()"
            />
          </div>
          <div class="btn-group align-items-end">
            <button
              type="button"
              class="btn btn-primary dropdown-toggle h-75"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Ordina per
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item text-black"
                  (click)="setSorting('costoGiornaliero', 'asc')"
                  >Costo Giornaliero
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="black"
                    class="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                    /></svg></a>
              </li>
              <li>
                <a
                  class="dropdown-item text-black"
                  (click)="setSorting('costoGiornaliero', 'desc')"
                  >Costo Giornaliero
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="black"
                    class="bi bi-caret-down-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                    /></svg></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row mt-3 px-3">
        <div class="col-md-4" *ngFor="let car of cars; let i = index">
          <div class="pb-3 h-100">
          <div class="card h-100">
            <img *ngIf="!mostraForm[i]" [src]="car.foto" class="card-img-top cars-img" alt="..." />
            <div *ngIf="mostraForm[i]">
  <div class="form-group mx-1 mx-md-4 my-3">
    <label class="text-primary" for="dataInizio">Data di Inizio</label>
    <input
      type="date"
      class="form-control"
      [(ngModel)]="dataInizio"
      id="dataInizio"
    />
  </div>
  <div class="form-group mx-1 mx-md-4 mb-3">
    <label class="text-primary" for="dataFine">Data di Fine</label>
    <input
      type="date"
      class="form-control"
      [(ngModel)]="dataFine"
      id="dataFine"
    />
  </div>
  <div class="form-group mx-1 mx-md-4">
    <button class="btn btn-danger me-3" (click)="annulla(i)">Annulla</button>
    <button class="btn btn-success" (click)="conferma(i)">Conferma</button>
  </div>
</div>
            <div class="card-body row">
              <div class="col-7">
              <h5 class="card-title">{{ car.marca }} {{ car.modello }}</h5>
              <p class="card-text">€ {{ car.costoGiornaliero }}/giorno</p>
            </div>
            <div class="col-5 d-flex justify-content-center align-items-center pe-0">
            <button class="btn btn-primary me-2" [routerLink]="['/details' , car.id]">Dettagli</button>
            <button *ngIf="user && !formAperto" class="btn btn-primary" (click)="mostraFormPrenotazione(i)">Prenota</button>
            </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="col-0 col-md-2 border carrello" *ngIf="user && bookings.length > 0">
<div class="border row px-0 py-2"><div class="col-8 d-flex justify-content-center align-items-center px-0"><h2 class="text-center py-1">Carrello</h2></div><div class="col-4 d-flex justify-content-center align-items-center px-0"><button type="button" class="btn btn-success fs-5" [routerLink]="['/checkout']">Acquista</button></div></div>
<div *ngIf="bookings.length > 0" class="text-center fs-4 py-1 border-bottom">Costo totale: {{ totalCost }}€</div>
<div class="d-flex flex-column align-items-center">
 <div class="card my-2" *ngFor="let booking of bookings; let i = index" style="width: 18rem;">
          <div class="card-header">
Nome modello: {{booking.nomeModello}}
          </div>
           <ul *ngIf="!modificaForm[i]" class="list-group list-group-flush">
            <li class="list-group-item">Inizio: {{booking.dataInizio}}</li>
            <li class="list-group-item">Fine: {{booking.dataFine}}</li>
            <li class="list-group-item">Costo totale: {{booking.costoTotale}}€</li>
            <li class="list-group-item d-flex justify-content-between">
              <a *ngIf="!formAperto" class="text-warning" (click)="modifyBooking(i)">Modifica</a>
              <a *ngIf="!formAperto" class="text-danger" (click)="deleteBooking(i)">Cancella</a>
            </li>
          </ul>
<div *ngIf="modificaForm[i]">
  <div class="form-group mx-1 mx-md-4 my-3">
    <label class="text-primary" for="dataInizio">Data di Inizio</label>
    <input
      type="date"
      class="form-control"
      [(ngModel)]="dataInizio"
      id="dataInizio"
    />
  </div>
  <div class="form-group mx-1 mx-md-4 mb-3">
    <label class="text-primary" for="dataFine">Data di Fine</label>
    <input
      type="date"
      class="form-control"
      [(ngModel)]="dataFine"
      id="dataFine"
    />
  </div>
  <div class="form-group mx-1 mx-md-4 mb-2">
    <button class="btn btn-danger me-3" (click)="annullaModifica(i)">Annulla</button>
    <button class="btn btn-success" (click)="confermaModifica(i)">Conferma</button>
  </div>
</div>
        </div>
 </div>
    </div>
  </div>
  `,
  styles: [
    `
      .bg-light {
        background-color: lightgray !important;
      }
      .dropdown-item {
        color: #007bff !important;
        background-color: white !important;
      }
      .text-black {
        color: black !important;
      }
      .carrello{
        position : sticky !important;
        top: 0;
        z-index: 1;
        margin: 0;
      }
      .cars-img{
        height :85%;
      }
    `,
  ],
})
export class CarsComponent implements OnInit {
  user: any = null;
  private subscription: Subscription | null = null;

  cars: CarPayload[] = [];
  bookings: any[] = [];
  marca: string = '';
  modello: string = '';
  colore: string = '';
  sortBy: string = '';
  direction: string = '';

  mostraForm: { [key: number]: boolean } = {};
  modificaForm: { [key: number]: boolean } = {};
  formAperto: boolean = false;
  dataInizio: string = '';
  dataFine: string = '';
  totalCost: number = 0;

  constructor(private carService: CarService, private userService: UserService, private authSrv: AuthService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.subscription = this.authSrv.currentUser$.subscribe((user) => {
      console.log('User:', user);
      this.user = user;
    });
    this.carService.cars$.subscribe(cars => {
      this.cars = cars;
    });
    this.carService.refreshCars();
    this.bookingService.deleteExpiredBooking().subscribe(
      response => {
        console.log('Prenotazioni scadute eliminate:', response);
      },
      error => {
        console.error('Errore nell\'eliminazione delle prenotazioni scadute:', error);
      }
    );
    this.loadUserBookings();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculateTotalCost(): void {
    this.totalCost = this.bookings.reduce((acc, booking) => acc + booking.costoTotale, 0);
    console.log("Costo totale" + this.totalCost)
  }

  onSearch(): void {
    if (this.marca)
      this.carService
        .getCarsByMarca(this.marca)
        .subscribe((cars) => (this.cars = cars));
    else if (this.modello)
      this.carService
        .getCarsByModello(this.modello)
        .subscribe((cars) => (this.cars = cars));
    else if (this.colore)
      this.carService
        .getCarsByColore(this.colore)
        .subscribe((cars) => (this.cars = cars));
    else if (this.sortBy && this.direction)
      this.carService
        .getAllCarsSorted(this.sortBy, this.direction)
        .subscribe((cars) => (this.cars = cars));
    else this.carService.getAllCars();
  }

  setSorting(sortBy: string, direction: string): void {
    this.sortBy = sortBy;
    this.direction = direction;
    this.onSearch();
  }

  loadUserBookings(): void {
    this.userService.getOpenBookingsForCurrentUser().subscribe(
      (bookings) => {
        this.bookings = bookings;
        this.calculateTotalCost();
        bookings.forEach((index: number) => this.mostraForm[index] = false,
          (booking: any) => {
          console.log('Booking:', booking);
        });
      },
      (error) => {
        console.error('Error loading user bookings', error);
      }
    );
  }

  mostraFormPrenotazione(index: number) {
    this.mostraForm[index] = true;
    this.formAperto = true;
}

conferma(index: number) {
  if (this.dataInizio && this.dataFine) {
    this.createBooking(this.cars[index], this.dataInizio, this.dataFine);
    this.dataInizio = '';
    this.dataFine = '';
    this.mostraForm[index] = false;
    this.formAperto = false;
  }
}

  annulla(index: number) {
    console.log('Operazione annullata');

    this.dataInizio = '';
    this.dataFine = '';
    this.mostraForm[index] = false;
    this.formAperto = false;
  }


  createBooking(car: any, dataInizio: string, dataFine: string): void {
    const newBooking: BookingPayload = {
      dataInizio: new Date(dataInizio),
      dataFine: new Date(dataFine),
      carId: car.id
    };

    this.bookingService.createBooking(newBooking).subscribe(
      (booking) => {
        alert('Booking creato:');
        this.loadUserBookings();
      },
      (error) => {
        alert('Date inserite non disponibili');
        console.error(error)
      }
    );
  }

  modifyBooking(index: number): void {
    this.modificaForm[index] = true;
    this.dataInizio = '';
    this.dataFine = '';
    this.formAperto = true;
}

confermaModifica(index: number) {
  if (this.dataInizio && this.dataFine) {
      this.updateBooking(index, this.dataInizio, this.dataFine);
      this.dataInizio = '';
      this.dataFine = '';
      this.modificaForm[index] = false;
      this.formAperto = false;
  }
}


  annullaModifica(index: number) {
    console.log('Operazione annullata');

    this.dataInizio = '';
    this.dataFine = '';
    this.modificaForm[index] = false;
    this.formAperto = false;
  }

  updateBooking(index: number, dataInizio: string, dataFine: string): void {
    const newBooking: BookingPayload = {
      dataInizio: new Date(dataInizio),
      dataFine: new Date(dataFine),
      carId: this.bookings[index].carId
    };

    const bookingId = this.bookings[index].id;
    console.log(bookingId);
    this.bookingService.updateBooking(bookingId, newBooking).subscribe(
      (booking) => {
        alert('Booking modificato:');
        this.loadUserBookings();
      },
      (error) => {
        alert('Date inserite non disponibili');
        console.error(error);
      }
    );
}


deleteBooking(index: number): void {
  const bookingToDelete = this.bookings[index];
  if (bookingToDelete && bookingToDelete.id) {
    console.log(bookingToDelete.id);
    this.bookingService.deleteBooking(bookingToDelete.id).subscribe(
      () => {
        this.loadUserBookings();
      },
      error => {
        console.error('Error deleting booking', error);
      }
    );
  }
}

}
