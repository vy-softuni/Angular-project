// src/app/posts/catalog/catalog.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { IPost } from 'src/app/core/types/post';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  posts$: Observable<IPost[]> | undefined;
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.posts$ = this.apiService.getPosts().pipe(
      tap({
        next: () => { this.isLoading = false; },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message;
          console.error(err);
        }
      })
    );
  }
}