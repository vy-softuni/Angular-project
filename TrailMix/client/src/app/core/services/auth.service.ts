import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';

interface AuthResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _user$ = new BehaviorSubject<User | null>(this.restoreUser());
  user$ = this._user$.asObservable();

  get token(): string | null { return localStorage.getItem('tm_token'); }
  get isLoggedIn(): boolean { return !!this.token; }
  get currentUser(): User | null { return this._user$.value; }
  private baseUrl = environment.apiUrl;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.persist(res)));
  }

  register(email: string, password: string, displayName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, { email, password, displayName })
      .pipe(tap(res => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    this._user$.next(null);
    window.location.href = '/';
  }

  private persist(res: AuthResponse) {
    localStorage.setItem('tm_token', res.token);
    localStorage.setItem('tm_user', JSON.stringify(res.user));
    this._user$.next(res.user);
  }

  private restoreUser(): User | null {
    try { const raw = localStorage.getItem('tm_user'); return raw ? JSON.parse(raw) as User : null; }
    catch { return null; }
  }
}
