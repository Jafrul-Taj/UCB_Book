import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EditableMember, Member, Photo } from '../../types/member';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  editMode = signal(false);
  member = signal<Member | null>(null);
  gerMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member)
      })
    );
  }

  getMemberPhoto(id: string){
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember){
    return this.http.put(this.baseUrl + 'members', member);
  }

  uploadPhoto(file: File){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl+'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo){
    return this.http.put(this.baseUrl+'members/set-main-photo/'+photo.id,{});
  }
}
