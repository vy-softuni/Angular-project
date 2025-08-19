import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  list(hikeId: string): Observable<Comment[]> { return this.http.get<Comment[]>(`${this.baseUrl}/comments/${hikeId}`); }
  create(hikeId: string, content: string): Observable<Comment> { return this.http.post<Comment>(`${this.baseUrl}/comments/${hikeId}`, { content }); }
  remove(commentId: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/comments/item/${commentId}`); }
}
