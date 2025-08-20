import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Hike } from '../models/hike';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  me(): Observable<User> { return this.http.get<User>(`${this.baseUrl}/users/me`); }
  get(id: string): Observable<User> { return this.http.get<User>(`${this.baseUrl}/users/${id}`); }
  likes(id: string): Observable<Hike[]> { return this.http.get<Hike[]>(`${this.baseUrl}/users/${id}/likes`); }
  hikes(id: string): Observable<Hike[]> { return this.http.get<Hike[]>(`${this.baseUrl}/users/${id}/hikes`); }
  updateMe(data: Partial<User>): Observable<User> { return this.http.put<User>(`${this.baseUrl}/users/me`, data); }

  listUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.baseUrl}/admin/users`); }
  setRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/admin/users/${userId}/role`, { role });
  }
}
