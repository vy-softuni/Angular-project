import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HikesService } from '../../core/services/hikes.service';
import { Hike } from '../../core/models/hike';
import { UploadBoxComponent } from '../../shared/components/upload-box/upload-box.component';

type FormModel = {
  title: string;
  description: string;
  location: { lat: number; lng: number; name?: string };
  distanceKm: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  images: string[];
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, UploadBoxComponent],
  templateUrl: './create-edit.component.html'
})
export class CreateEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hs = inject(HikesService);

  id: string | null = null;
  model: FormModel = {
    title: '',
    description: '',
    location: { lat: 42.69, lng: 23.32, name: 'Default' },
    distanceKm: 5,
    difficulty: 'easy',
    images: []
  };

  imageUrl = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.hs.getById(this.id).subscribe((h: Hike) => {
        this.model = {
          title: h.title,
          description: h.description,
          location: h.location || { lat: 0, lng: 0, name: '' },
          distanceKm: h.distanceKm ?? 0,
          difficulty: h.difficulty,
          images: Array.isArray(h.images) ? h.images : []
        };
        this.imageUrl = this.model.images[0] || '';
      });
    }
  }

  submit() {
    this.model.images = this.imageUrl ? [this.imageUrl] : [];
    if (this.id) {
      self.scrollTo(0,0);
      this.hs.update(this.id, this.model).subscribe(() => this.router.navigateByUrl('/catalog'));
    } else {
      self.scrollTo(0,0);
      this.hs.create(this.model).subscribe(() => this.router.navigateByUrl('/catalog'));
    }
  }
}
