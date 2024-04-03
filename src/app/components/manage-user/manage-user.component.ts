import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-manage-user',
  template: `
   <div id="main" class="m-4 row">
    <h3 class="text-center">Tutti gli utenti:</h3>
    <div *ngFor="let user of users" class="col-12 col-md-3 mt-2">
        <div class="card">
            <div class="card-header">ID utente: {{user.id}}</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Nome: {{user.name}}</li>
                <li class="list-group-item">Cognome: {{user.surname}}</li>
                <li class="list-group-item">Email: {{user.email}}</li>
                <li class="list-group-item">Ruolo: {{user.role}}</li>
                <li class="list-group-item d-flex justify-content-between">
                <a class="text-warning" (click)="changeRole(user.id);">Cambia ruolo</a>
                    <a class="text-danger" (click)="deleteUser(user.id);">Cancella</a>
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
export class ManageUserComponent implements OnInit {
  users: any[] = [];
  currentUserId: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.getCurrentUser();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  getCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUserId = user.id;
    }, error => {
      console.error('Error getting current user', error);
      this.currentUserId = null;
    });
  }

  changeRole(userId: string): void {
    this.userService.changeRole(userId).subscribe(response => {
      this.loadUsers();
    });
  }

  deleteUser(userId: string): void {
    if (userId === this.currentUserId) {
      alert('Non puoi cancellare l\'utente corrente da qui, vai nella pagina profilo');
      return;
    }

    this.userService.deleteUser(userId).subscribe(response => {
      this.loadUsers();
    });
  }
}
