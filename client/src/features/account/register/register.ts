import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {  AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register  {
  
  private accountService = inject(AccountService);
  private router = inject(Router);
  cancelRegister= output<boolean>();
  protected creds = {} as RegisterCreds;
  private fb = inject(FormBuilder)
  private toast= inject(ToastService);
  protected profileForm: FormGroup;
  protected credentialForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor(){
     this.credentialForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      displayName: ['',[Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    })
    this.credentialForm.controls['password'].valueChanges.subscribe(()=>{
      this.credentialForm.controls['confirmPassword'].updateValueAndValidity();
    })

    this.profileForm = this.fb.group({
      gender:['male', Validators.required],
      dateOfBirth:['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
  })
  }

  nextStep(){
    if(this.credentialForm.valid){
      this.currentStep.update(prevStep => prevStep+1);
    }
  }

  
  prevStep(){
    this.currentStep.update(prevStep => prevStep-1);
  }


  register(){
    if(this.profileForm.valid && this.credentialForm.valid){
      const formData = {...this.credentialForm.value, ...this.profileForm.value};
      this.accountService.register(formData).subscribe({
        next: () => {
            this.router.navigateByUrl('/members');
            //this.cancel();
        },
        error: error =>{
          console.log(error);
          this.validationErrors.set(error);
        } 
      }) 
    }
  }
  getMaxDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear()-18);
    return today.toISOString().split('T')[0];
  }

  matchValues(matchTo: string): ValidatorFn 
  {
    return(control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;

      if(!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : {passwordMismatch:true}

    }
  }

  
  
  cancel() {
    this.cancelRegister.emit(false);
  }
}
