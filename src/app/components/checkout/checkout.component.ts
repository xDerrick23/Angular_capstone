import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/service/booking.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="d-flex justify-content-center my-3 checkout-container">
      <form
        [formGroup]="checkoutForm"
        class="p-5 shadow checkout-form"
        (ngSubmit)="onSubmit()"
      >
        <div class="mb-3">
          <label for="cardName" class="form-label">Nome Intestatario</label>
          <input
            type="text"
            class="form-control"
            id="cardName"
            formControlName="cardName"
            required
          />
        </div>
        <div class="mb-3">
          <label for="cardNumber" class="form-label">Numero della Carta</label>
          <input
            type="tel"
            class="form-control"
            id="cardNumber"
            formControlName="cardNumber"
            required
          />
        </div>
        <div class="mb-3">
          <label for="cvv" class="form-label">CVV</label>
          <input
            type="tel"
            class="form-control"
            id="cvv"
            formControlName="cvv"
            required
          />
        </div>
        <button
          *ngIf="!formAperto"
          type="submit"
          class="btn btn-success"
          [disabled]="!checkoutForm.valid"
        >
          Conferma
        </button>
      </form>
    </div>
    <h3 class="text-center">Stai confermando queste prenotazioni</h3>
    <div class="row m-4">

        <div
          *ngFor="let booking of openBookings; let i = index"
class="col-12 col-md-2"
        ><div><div class="card mt-2 px-2">
          <div class="card-header">Nome modello: {{ booking.nomeModello }}</div>
          <ul *ngIf="!modificaForm[i]" class="list-group list-group-flush">
            <li class="list-group-item">Inizio: {{ booking.dataInizio }}</li>
            <li class="list-group-item">Fine: {{ booking.dataFine }}</li>
            <li class="list-group-item">
              Costo totale: {{ booking.costoTotale }}€
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <a
                *ngIf="!formAperto"
                class="text-warning"
                (click)="toggleModificationForm(i, booking)"
                >Modifica</a
              >
              <a
                *ngIf="!formAperto"
                class="text-danger"
                (click)="deleteBooking(booking.id)"
                >Cancella</a
              >
            </li>
          </ul>

          <div *ngIf="modificaForm[i]" class="p-2">
            <div class="form-group mx-1 mx-md-4 my-3">
              <label class="text-primary" for="dataInizio"
                >Data di Inizio</label
              >
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
              <button
                type="button"
                class="btn btn-danger me-3"
                (click)="annullaModifica(i)"
              >
                Annulla
              </button>
              <button
                class="btn btn-success"
                (click)="modifyBooking(booking.id)"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

  `,
  styles: [
    `
      .checkout-container {
        background-color: white;
      }
    `,
    `
      .checkout-form {
        width: 300px;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  user: any;
  openBookings: any[] = [];
  closedBookings: any[] = [];
  modificaForm: boolean[] = [];
  formAperto: boolean = false;
  updatedBooking: any = {};
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private bookingService: BookingService,
    private router : Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required,],
      cvv: ['', Validators.required],
    });
    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.userService
        .getUserOpenBookings()
        .subscribe((bookings) => (this.openBookings = bookings));
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Form Submitted!', this.checkoutForm.value);
      this.paymentService.createPayment().subscribe(
        response => {
          console.log('Payment created!', response);
          this.router.navigate(['/cars'])
          alert("Grazie per aver prenotato da noi!")
        },
        error => {
          console.error('Error creating payment!', error);
          alert("Pagamento non riuscito")
        }
      );
    }
  }


  modifyBooking(id: string): void {
    const existingBooking = this.openBookings.find((b) => b.id === id);
    if (!existingBooking) {
      console.error('Booking not found');
      return;
    }

    const updatedBooking = {
      dataInizio: this.updatedBooking.dataInizio || existingBooking.dataInizio,
      dataFine: this.updatedBooking.dataFine || existingBooking.dataFine,
      carId: existingBooking.carId || null,
    };

    this.bookingService.updateBooking(id, updatedBooking).subscribe(
      (updated) => {
        console.log('Booking modified successfully!', updated);
        const index = this.openBookings.findIndex((b) => b.id === id);
        if (index > -1) this.openBookings[index] = updated;
        this.modificaForm[index] = false;
        this.formAperto = false;
      },
      (error) => console.error('Error modifying booking', error)
    );
  }

  deleteBooking(id: string): void {
    this.bookingService.deleteBooking(id).subscribe(
      () => {
        console.log('Booking deleted successfully!');
        this.openBookings = this.openBookings.filter(
          (booking) => booking.id !== id
        );
      },
      (error) => console.error('Error deleting booking', error)
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
}
