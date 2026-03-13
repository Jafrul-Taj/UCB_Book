import { inject, Injectable } from '@angular/core';
import { isNotFound } from '@angular/core/primitives/di';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private router = inject(Router);

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      document.body.appendChild(container);
    }
  }
  private createToastElement(message: string, alertClass: string, duration: number = 5000, 
      avater?:string, route?:string) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass,'shadow-lg','flex',
      'items-center','gap-3','cursor-pointer');

    if(route) {
      toast.addEventListener('click', () => {
        this.router.navigateByUrl(route);
      });
    }
    
      toast.innerHTML = `
      ${avater ? `<img src=${avater || '/user.png'} class='w-10 h-10 rounded' ` : ''}
      <span>${message}</span>
      <button class="ml-4 btn btn-sn btn-ghost">X</button>
    `
    

    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {  
      if(toastContainer.contains(toast)){
      toastContainer.removeChild(toast);  
      }
      
    }, duration);

  }

  success(message: string, duration?: number, avater?:string, route?:string) {
    this.createToastElement(message, 'alert-success', duration, avater, route);
  } 

  error(message: string, duration?: number, avater?:string, route?:string) {
    this.createToastElement(message, 'alert-error', duration, avater, route);
  } 
  warning(message: string, duration?: number, avater?:string, route?:string) {
    this.createToastElement(message, 'alert-warning', duration, avater, route);
  } 
  info(message: string, duration?: number,  avater?:string, route?:string) {
    this.createToastElement(message, 'alert-info', duration, avater, route);
  } 
}
