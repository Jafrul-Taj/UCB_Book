import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Nav } from "../layout/nav/nav";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Nav]
})
export class App implements  OnInit{
  
  private http = inject(HttpClient);
  protected readonly title = signal('Ucb Book');
  protected members = signal<any>([]);


  async ngOnInit() {
    this.members.set(await this.getMembers());
  }

   async getMembers() {
   try {

    return  lastValueFrom(this.http.get('https://localhost:5001/api/members'));

   } catch (err) {
     console.error('Failed to fetch members', err);
     throw err;
   } 
  }
}
