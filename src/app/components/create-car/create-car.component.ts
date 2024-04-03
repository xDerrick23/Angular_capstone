import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarPayload } from 'src/app/interface/car-payload';
import { CarService } from 'src/app/service/car.service';

@Component({
  selector: 'app-create-car',
  template: `
   <div class="container d-flex justify-content-center my-2">
  <form [formGroup]="carForm" (ngSubmit)="onSubmit()" class="bg-white p-5 rounded shadow form-container" novalidate>
    <h2 class="mb-4 text-primary text-center">Crea veicolo</h2>

    <div class="mb-3">
      <label for="foto" class="form-label">Foto</label>
      <input type="text" formControlName="foto" id="foto" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="marca" class="form-label">Marca</label>
      <input type="text" formControlName="marca" id="marca" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="modello" class="form-label">Modello</label>
      <input type="text" formControlName="modello" id="modello" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="colore" class="form-label">Colore</label>
      <input type="text" formControlName="colore" id="colore" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="motore" class="form-label">Motore</label>
      <input type="text" formControlName="motore" id="motore" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="cilindrata" class="form-label">Cilindrata</label>
      <input type="text" formControlName="cilindrata" id="cilindrata" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="potenza" class="form-label">Potenza</label>
      <input type="text" formControlName="potenza" id="potenza" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="tipoDiAlimentazione" class="form-label">Tipo Di Alimentazione</label>
      <input type="text" formControlName="tipoDiAlimentazione" id="tipoDiAlimentazione" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="consumoAKm" class="form-label">Consumo A Km</label>
      <input type="text" formControlName="consumoAKm" id="consumoAKm" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="costoGiornaliero" class="form-label">Costo Giornaliero</label>
      <input type="number" formControlName="costoGiornaliero" id="costoGiornaliero" class="form-control" required />
    </div>

    <div class="mb-3">
      <button type="submit" class="btn btn-primary w-100" [disabled]="carForm.invalid">Crea Auto</button>
    </div>
  </form>
</div>

  `,
  styles: [`
.form-container {
  width: 75%;
}
  `
  ]
})
export class CreateCarComponent implements OnInit {
  carForm: FormGroup;

  constructor(private fb: FormBuilder, private carService: CarService) {
    this.carForm = this.fb.group({
      foto: ['', Validators.required],
      marca: ['', Validators.required],
      modello: ['', Validators.required],
      colore: ['', Validators.required],
      motore: ['', Validators.required],
      cilindrata: ['', Validators.required],
      potenza: ['', Validators.required],
      tipoDiAlimentazione: ['', Validators.required],
      consumoAKm: ['', Validators.required],
      costoGiornaliero: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const payload: CarPayload = this.carForm.value;
      this.carService.createCar(payload).subscribe(response => {
        alert("Auto aggiunta")
        console.log('Auto creata:', response);
      });
    }
  }
}
