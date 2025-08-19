import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HikesService } from '../../core/services/hikes.service';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  hs = inject(HikesService);
  search = '';
  difficulty = '';

  ngOnInit(): void {
    this.search = '';
    this.difficulty = '';
    this.hs.setQuery({});
    this.hs.loadAll().subscribe();
  }

  applyFilters() { this.hs.setQuery({ search: this.search, difficulty: this.difficulty }); }
  clearFilters() { this.search = ''; this.difficulty = ''; this.applyFilters(); }
  onImgError(ev: Event) { (ev.target as HTMLImageElement).src = 'assets/placeholder.png'; }
}
