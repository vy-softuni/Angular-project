import { Routes } from '@angular/router';
import { canActivateAuth } from './core/guards/auth.guard';
import { canActivateGuest } from './core/guards/guest.guard';
import { canActivateAdmin } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'hike/:id', loadComponent: () => import('./features/details/details.component').then(m => m.DetailsComponent) },
  { path: 'profile/me', canActivate: [canActivateAuth], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), data: { me: true } },
  { path: 'profile/:id', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'create', canActivate: [canActivateAuth], loadComponent: () => import('./features/hike-form/create-edit.component').then(m => m.CreateEditComponent) },
  { path: 'edit/:id', canActivate: [canActivateAuth], loadComponent: () => import('./features/hike-form/create-edit.component').then(m => m.CreateEditComponent) },
  { path: 'login', canActivate: [canActivateGuest], loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [canActivateGuest], loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'admin', canActivate: [canActivateAdmin], loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: 'catalog' }
];
