import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface UploadResponse { url: string; }

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  uploadImage(file: File): Observable<UploadResponse> {
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post<UploadResponse>(`${this.baseUrl}/uploads/image`, fd);
  }

  deleteByUrl(url: string): Observable<void> {
    const params = new HttpParams().set('url', url);
    return this.http.delete<void>(`${this.baseUrl}/uploads`, { params });
  }
}
