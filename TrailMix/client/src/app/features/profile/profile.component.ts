import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HikesService } from '../../core/services/hikes.service';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { Hike } from '../../core/models/hike';
import { User } from '../../core/models/user';
import { UploadBoxComponent } from '../../shared/components/upload-box/upload-box.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TruncatePipe, UploadBoxComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private hs = inject(HikesService);
  private users = inject(UsersService);
  auth = inject(AuthService);

  userId!: string;
  isMe = false;
  user!: User;
  myHikes: Hike[] = [];
  liked: Hike[] = [];

  edit = { displayName: '', avatarUrl: '' };
  saving = false;

  ngOnInit(): void {
    const meFlag = this.route.snapshot.data['me'];
    if (meFlag) {
      this.userId = this.auth.currentUser?._id || '';
      this.isMe = true;
    } else {
      this.userId = this.route.snapshot.paramMap.get('id')!;
      this.isMe = this.auth.currentUser?._id === this.userId;
    }
    if (!this.userId) return;

    this.users.get(this.userId).subscribe(u => {
      this.user = u;
      this.edit.displayName = u.displayName || '';
      this.edit.avatarUrl = u.avatarUrl || '';
    });
    this.users.hikes(this.userId).subscribe(list => this.myHikes = list);
    this.users.likes(this.userId).subscribe(list => this.liked = list);
  }

  save() {
    if (!this.isMe) return;
    this.saving = true;
    this.users.updateMe({ displayName: this.edit.displayName, avatarUrl: this.edit.avatarUrl })
      .subscribe(u => {
        this.saving = false;
        this.user = u;
        localStorage.setItem('tm_user', JSON.stringify(u));
        alert('Profile updated');
      });
  }

  onImgError(ev: Event) { (ev.target as HTMLImageElement).src = 'assets/placeholder.png'; }
}
