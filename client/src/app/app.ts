import { Component, inject, OnInit } from '@angular/core';
import { Nav } from "../layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '../core/services/account-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Nav,RouterOutlet]
})
export class App implements OnInit {
  protected router = inject(Router);
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.restoreUser();
  }

  private restoreUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
