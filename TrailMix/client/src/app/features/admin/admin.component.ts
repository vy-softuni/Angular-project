import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { HikesService } from '../../core/services/hikes.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  private usersSvc = inject(UsersService);
  private hikesSvc = inject(HikesService);

  users: any[] = [];
  hikes: any[] = [];

  ngOnInit(): void {
    this.usersSvc.listUsers().subscribe(u => this.users = u);
    this.hikesSvc.loadAll().subscribe(h => this.hikes = h || []);
  }

  promote(u: any) { this.usersSvc.setRole(u._id, 'admin').subscribe(x => u.role = x.role); }
  demote(u: any) {
    const meRaw = localStorage.getItem('tm_user');
    const meId = meRaw ? JSON.parse(meRaw)._id : null;
    if (meId && meId === u._id) { alert('Forbidden: you cannot revoke your own admin role.'); return; }
    this.usersSvc.setRole(u._id, 'user').subscribe({
      next: (x) => u.role = x.role,
      error: () => alert('Forbidden: you cannot revoke your own admin role.')
    });
  }
}
