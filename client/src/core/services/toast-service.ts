import { Injectable } from '@angular/core';
import { isNotFound } from '@angular/core/primitives/di';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   *
   */
  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }
  private createToastElement(message: string, alertClass: string, duration: number = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass,'shadow-lg');
    toast.innerHTML = `
      <div>
        <span>${message}</span>
        <button class="ml-4 btn btn-sn btn-ghost">X</button>
      </div>
    `;

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

  success(message: string, duration?: number ) {
    this.createToastElement(message, 'alert-success', duration);
  } 

  error(message: string, duration?: number ) {
    this.createToastElement(message, 'alert-error', duration);
  } 
  warning(message: string, duration?: number ) {
    this.createToastElement(message, 'alert-warning', duration);
  } 
  info(message: string, duration?: number ) {
    this.createToastElement(message, 'alert-info', duration);
  } 
}
