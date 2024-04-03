import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  template: `
    <div id='main' class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card bg-white p-4">
            <h4 class="text-primary mb-3 text-center">Registrati</h4>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="text-primary mb-1">Nome</label>
                <input type="text" class="form-control" formControlName="name" required>
              </div>
              <div class="form-group">
                <label class="text-primary my-1">Cognome</label>
                <input type="text" class="form-control" formControlName="surname" required>
              </div>
              <div class="form-group">
    <label class="text-primary my-1">Email</label>
    <input type="email" class="form-control" formControlName="email" required>
    <div *ngIf="registerForm.controls['email'].invalid && registerForm.controls['email'].touched" class="text-danger">
        Inserisci un indirizzo email valido.
    </div>
</div>

              <div class="form-group">
                <label class="text-primary my-1">Password</label>
                <input type="password" class="form-control" formControlName="password" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block mt-4" [disabled]="registerForm.invalid">Registrati</button>
            </form>
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUser = this.registerForm.value;
      this.authService.register(newUser).subscribe(
        response => {
          alert("Registrato con successo!");
          this.router.navigate(['/login']);
        },
        error => {
          console.error("Errore durante la registrazione!", error);
        }
      );
    }
  }
}
