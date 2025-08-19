import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { Hike } from '../models/hike';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HikesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private _hikes$ = new BehaviorSubject<Hike[] | null>(null);
  hikes$ = this._hikes$.asObservable();

  private _query$ = new BehaviorSubject<{ search?: string; difficulty?: string }>({});
  filteredHikes$ = combineLatest([this.hikes$, this._query$]).pipe(
    map(([hikes, query]) => {
      if (!hikes) return [];
      return hikes.filter(h => {
        const matchSearch = query.search
          ? (h.title + ' ' + h.description).toLowerCase().includes(query.search.toLowerCase())
          : true;
        const matchDiff = query.difficulty ? h.difficulty === query.difficulty : true;
        return matchSearch && matchDiff;
      });
    })
  );

  loadAll(): Observable<Hike[]> {
    return this.http.get<Hike[]>(`${this.baseUrl}/hikes`).pipe(
      tap(h => this._hikes$.next(h)),
      catchError(_ => { this._hikes$.next([]); return of([]); })
    );
  }

  getById(id: string): Observable<Hike> { return this.http.get<Hike>(`${this.baseUrl}/hikes/${id}`); }
  create(payload: Partial<Hike>): Observable<Hike> {
    return this.http.post<Hike>(`${this.baseUrl}/hikes`, payload).pipe(tap(() => this.loadAll().subscribe()));
  }
  update(id: string, payload: Partial<Hike>): Observable<Hike> {
    return this.http.put<Hike>(`${this.baseUrl}/hikes/${id}`, payload).pipe(tap(() => this.loadAll().subscribe()));
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hikes/${id}`).pipe(tap(() => this.loadAll().subscribe()));
  }
  like(id: string): Observable<{ likes: string[] }> {
    return this.http.post<{ likes: string[] }>(`${this.baseUrl}/hikes/${id}/like`, {})
      .pipe(tap(() => this.loadAll().subscribe()));
  }
  unlike(id: string): Observable<{ likes: string[] }> {
    return this.http.post<{ likes: string[] }>(`${this.baseUrl}/hikes/${id}/unlike`, {})
      .pipe(tap(() => this.loadAll().subscribe()));
  }
  setQuery(q: { search?: string; difficulty?: string }) { this._query$.next(q); }
}
