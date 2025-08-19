import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const canActivateGuest: CanActivateFn = () => { const router = inject(Router); const token = localStorage.getItem('tm_token'); if (token) { router.navigateByUrl('/catalog'); return false; } return true; };
