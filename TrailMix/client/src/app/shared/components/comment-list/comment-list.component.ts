import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../../core/services/comments.service';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../../core/models/comment';

@Component({
  selector: 'tm-comment-list',
  standalone: true,
  imports: [CommonModule, DateAgoPipe, FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() hikeId!: string;

  private cs = inject(CommentsService);
  auth = inject(AuthService);

  comments: Comment[] = [];
  content = '';

  ngOnInit(): void { if (this.hikeId) this.reload(); }
  ngOnChanges(): void { if (this.hikeId) this.reload(); }

  reload() { this.cs.list(this.hikeId).subscribe(c => this.comments = c); }

  add() {
    if (!this.content.trim()) return;
    if (!this.auth.isLoggedIn) { alert('Please log in to comment'); return; }
    this.cs.create(this.hikeId, this.content.trim()).subscribe(() => { this.content = ''; this.reload(); });
  }

  remove(c: Comment) {
    this.cs.remove(c._id).subscribe(() => this.reload());
  }
}
