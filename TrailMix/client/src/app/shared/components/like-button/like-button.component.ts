import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'tm-like-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent {
  @Input() liked = false;
  @Input() count = 0;
  @Output() toggle = new EventEmitter<void>();
}
