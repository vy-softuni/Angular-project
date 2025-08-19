import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const canActivateAdmin: CanActivateFn = () => { const router = inject(Router); const raw = localStorage.getItem('tm_user'); const role = raw ? (JSON.parse(raw).role as string) : 'user'; if (role !== 'admin') { router.navigateByUrl('/'); return false; } return true; };
