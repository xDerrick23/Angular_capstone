import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-manage-payment',
  template: `
   <div id="main" class="m-4 row">
    <h3 class="text-center">Tutti i pagamenti:</h3>
    <div *ngFor="let payment of payments" class="col-12 col-md-3 mt-2">
        <div class="card">
            <div class="card-header">ID pagamento: {{payment.id}}</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Email acquirente: {{payment.emailAcquirente}}</li>
                <li class="list-group-item">Data pagamento: {{payment.dataPagamento}}</li>
                <li class="list-group-item">Costo totale: {{payment.costo}}€</li>
                <li class="list-group-item d-flex justify-content-between">
                    <a class="text-danger" (click)="deletePayment(payment.id);">Cancella</a>
                </li>
            </ul>
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
export class ManagePaymentComponent implements OnInit {

  payments: any[] = [];

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getAllPayments().subscribe(payments => {
      this.payments = payments;
    });
  }

  deletePayment(paymentId: string): void {
    this.paymentService.deletePayment(paymentId).subscribe(() => {
      this.payments = this.payments.filter(payment => payment.id !== paymentId);
    });
  }


}
