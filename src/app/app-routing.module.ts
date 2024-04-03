import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarsComponent } from './components/cars/cars.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DetailsComponent } from './components/details/details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateCarComponent } from './components/create-car/create-car.component';
import { ManageBookingComponent } from './components/manage-booking/manage-booking.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { ManagePaymentComponent } from './components/manage-payment/manage-payment.component';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [
  {
      path: '',
      component: HomeComponent,
  },
  {
      path: 'cars',
      component: CarsComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
},
  {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard],
  },
  {
      path: 'login',
      component: LoginComponent,
  },
  {
      path: 'register',
      component: RegisterComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
},
{
  path: 'createCar',
  component: CreateCarComponent,
  canActivate: [AdminGuard],
},
{
  path: 'manageBooking',
  component: ManageBookingComponent,
  canActivate: [AdminGuard],
},
{
  path: 'manageUser',
  component: ManageUserComponent,
  canActivate: [AdminGuard],
},
{
  path: 'managePayment',
  component: ManagePaymentComponent,
  canActivate: [AdminGuard],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
