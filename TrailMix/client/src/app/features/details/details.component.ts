import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HikesService } from '../../core/services/hikes.service';
import { LikeButtonComponent } from '../../shared/components/like-button/like-button.component';
import { CommentListComponent } from '../../shared/components/comment-list/comment-list.component';
import { AuthService } from '../../core/services/auth.service';
import { Hike } from '../../core/models/hike';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, LikeButtonComponent, CommentListComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hs = inject(HikesService);
  auth = inject(AuthService);

  hike!: Hike;
  liked = false;
  isOwnerOrAdmin = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.hs.getById(id).subscribe(h => {
      this.hike = h;
      const uid = this.auth.currentUser?._id;
      const role = this.auth.currentUser?.role;
      this.isOwnerOrAdmin = (uid === h.ownerId) || (role === 'admin');
      this.liked = !!uid && h.likes.includes(uid as string);
      setTimeout(() => this.initMap(h.location.lat, h.location.lng), 0);
    });
  }

  onImgError(ev: Event) { (ev.target as HTMLImageElement).src = 'assets/placeholder.png'; }

  toggleLike() {
    if (!this.auth.isLoggedIn) { this.router.navigateByUrl('/login'); return; }
    const id = this.hike._id;
    const obs = this.liked ? this.hs.unlike(id) : this.hs.like(id);
    obs.subscribe(() => this.hs.getById(id).subscribe(h => { this.hike = h; this.liked = !this.liked; }));
  }

  initMap(lat: number, lng: number) {
    const L = (window as any).L; if (!L) return;
    const map = L.map('map').setView([lat, lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([lat, lng]).addTo(map);
  }
}
