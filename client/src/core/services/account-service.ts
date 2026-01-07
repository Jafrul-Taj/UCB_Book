import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { user } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<user | null>(null);
  baseUrl = 'https://localhost:5001/api/';

  login(creds: any) {
    return this.http.post(this.baseUrl + 'account/login', creds).pipe(
      // tap((user: user | null) => {
      //   if(user) {
      //     this.currentUser.set(user);
      //   }
      // })
    );
  }
}
