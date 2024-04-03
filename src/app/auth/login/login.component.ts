import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div id='main' class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="text-primary text-center">Login</h3>

              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" [(ngModel)]="email" name="email" required>
                </div>
                <div class="mb-3 position-relative">
                  <label for="password" class="form-label">Password</label>
                  <input [type]="hidePassword ? 'password' : 'text'" class="form-control" id="password" [(ngModel)]="password" name="password" required>
                  <button type="button" (click)="togglePasswordVisibility()" class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" style="border: 0; background-color: transparent;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="gray" class="bi bi-eye-slash-fill mt-4 pointer-events-none" viewBox="0 0 16 16">
  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
</svg>
                  </button>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Submit</button>
              </form>

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
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        this.router.navigate(['']);
      },
      error => {
        console.error("Login error!", error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
