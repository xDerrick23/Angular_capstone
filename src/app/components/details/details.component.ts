import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CarService } from 'src/app/service/car.service';

@Component({
  selector: 'app-details',
  template: `
  <div class="container my-4" *ngIf="car">
    <div class="d-flex justify-content-center mb-3 mt-0">
      <button class="btn btn-primary" [routerLink]="['/cars']">Torna allo shop</button>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <img [src]="car.foto" alt="Foto dell'auto" *ngIf="car.foto" class="card-img-top"/>
          <div class="card-body" *ngIf="!editing">
            <h5 class="card-title">{{car.marca}} {{car.modello}}</h5>
            <p class="card-text">
              <strong>Colore:</strong> {{car.colore}} <br>
              <strong>Motore:</strong> {{car.motore}} <br>
              <strong>Cilindrata:</strong> {{car.cilindrata}} <br>
              <strong>Potenza:</strong> {{car.potenza}} <br>
              <strong>Tipo Di Alimentazione:</strong> {{car.tipoDiAlimentazione}} <br>
              <strong>Consumo A Km:</strong> {{car.consumoAKm}} <br>
              <strong>Costo Giornaliero:</strong> {{car.costoGiornaliero}} €
            </p>
          </div>
          <div *ngIf="editing">
            <div class="card-body">
            <label class="mb-1">Immagine: <input [(ngModel)]="car.foto" placeholder="Immagine" /></label><br />
              <label class="mb-1">Marca: <input [(ngModel)]="car.marca" placeholder="Marca" /></label><br />
              <label class="mb-1">Modello: <input [(ngModel)]="car.modello" placeholder="Modello" /></label><br />
              <label class="mb-1">Colore: <input [(ngModel)]="car.colore" placeholder="Colore" /></label><br />
              <label class="mb-1">Motore: <input [(ngModel)]="car.motore" placeholder="Motore" /></label><br />
              <label class="mb-1">Cilindrata: <input [(ngModel)]="car.cilindrata" placeholder="Cilindrata" /></label><br />
              <label class="mb-1">Potenza: <input [(ngModel)]="car.potenza" placeholder="Potenza" /></label><br />
              <label class="mb-1">Tipo Di Alimentazione: <input [(ngModel)]="car.tipoDiAlimentazione" placeholder="Tipo Di Alimentazione" /></label><br />
              <label class="mb-1">Consumo A Km: <input [(ngModel)]="car.consumoAKm" placeholder="Consumo A Km" /></label><br />
              <label class="mb-1">Costo Giornaliero: <input [(ngModel)]="car.costoGiornaliero" placeholder="Costo Giornaliero" /></label><br />
              <button class="btn btn-success me-2" (click)="toggleEdit()">Salva</button>
              <button class="btn btn-secondary" (click)="cancelEdit()">Annulla</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-evenly my-3" *ngIf="userRole === 'ADMIN'">
      <button class="btn btn-warning" (click)="toggleEdit()">{{ editing ? 'Annulla' : 'Modifica' }}</button>
      <button class="btn btn-danger" (click)="deleteCar()">Cancella</button>
    </div>
  </div>
  <div class="container mt-5" *ngIf="!car">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center">
        <p>Caricamento dettagli veicolo...</p>
      </div>
    </div>
  </div>
  `,
  styles: [
    `.container{
      min-height: 75vh;
    }`
  ]
})
export class DetailsComponent implements OnInit {
  car: any = null;
  originalCar: any = null;
  userRole: string = '';
  editing: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carService.getCarById(id).subscribe(
        car => this.car = car,
        error => console.error('Error loading car details', error)
      );
    }

    this.authService.currentUser$.subscribe(user => {
      if(user && user.role) this.userRole = user.role;
    });
  }

  toggleEdit(): void {
    if (this.editing) {
      this.saveChanges();
    } else {
      this.originalCar = { ...this.car };
    }
    this.editing = !this.editing;
  }

  cancelEdit(): void {
    this.car = { ...this.originalCar };
    this.editing = false;
  }

  deleteCar(): void {
    if (confirm('Sei sicuro di voler cancellare questa auto?')) {
      this.carService.deleteCar(this.car.id).subscribe(
        () => {
          console.log('Car deleted successfully');
          this.carService.refreshCars();
          this.router.navigate(['/cars']);
        },
        error => console.error('Error deleting car', error)
      );
    }
  }


  saveChanges(): void {
    this.carService.updateCar(this.car.id, this.car).subscribe(
      () => console.log('Car updated successfully'),
      error => console.error('Error updating car', error)
    );
  }

}
