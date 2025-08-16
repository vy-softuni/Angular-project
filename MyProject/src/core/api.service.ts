// src/app/core/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IPost } from './types/post';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private appKey = environment.appKey; // Replace with your backend App Key if needed
  private appSecret = environment.appSecret; // Replace with your backend App Secret if needed

  constructor(private http: HttpClient) { }

  // This is a placeholder for your actual API URL
  private get apiUrl() {
    return 'http://localhost:3030'; // CHANGE THIS TO YOUR BACKEND
  }

  getPosts(): Observable<IPost[]> {
    const url = `${this.apiUrl}/data/posts`;
    return this.http.get<IPost[]>(url).pipe(catchError(this.handleError));
  }
  
  // Add other methods for CRUD operations (getPostById, create, update, delete)

  private handleError(error: any) {
    console.error('API Error: ', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}