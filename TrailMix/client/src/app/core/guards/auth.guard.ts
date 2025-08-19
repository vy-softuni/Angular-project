import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const canActivateAuth: CanActivateFn = () => { const router = inject(Router); const token = localStorage.getItem('tm_token'); if (!token) { router.navigateByUrl('/login'); return false; } return true; };
