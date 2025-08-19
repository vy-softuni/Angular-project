import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe(catchError(err => { const status = err?.status ?? 'network'; const msg = err?.error?.message || err?.message || 'Request failed'; console.error('API error:', { method: req.method, url: req.url, status, err }); if (req.method !== 'GET') alert(`[${status}] ${msg}`); return throwError(() => err); }));
