import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  cancelRegister= output<boolean>();
  protected creds = {} as RegisterCreds;
  private toast= inject(ToastService);

  register() {
    // console.log('Registering user with credentials:', this.creds);
    this.accountService.register(this.creds).subscribe({
      next: user => {
        console.log('User registered successfully:', user);
        this.cancelRegister.emit(false);
        this.toast.success('Registration completed successfully.');
      },
      error: error => {
        console.error('Registration failed:', error);
        this.toast.error( error.error); 
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
