import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'tm-upload-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-box.component.html',
  styleUrls: ['./upload-box.component.css']
})
export class UploadBoxComponent {
  @Input() label = 'Upload file';
  @Input() currentUrl: string | null = null;
  @Output() changed = new EventEmitter<string | null>();

  private uploader = inject(UploadService);
  uploading = false;
  error = '';

  onFileInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onDragOver(ev: DragEvent) { ev.preventDefault(); }

  isImageUrl(url: string) { return /\.(png|jpe?g|gif|webp|bmp|svg|ico|heic|heif|tiff?)$/i.test(url); }

  preview() {
    if (!this.currentUrl) return;
    const base = window.location.origin;
    const url = this.currentUrl.startsWith('/') ? (base + this.currentUrl) : this.currentUrl;
    window.open(url, '_blank');
  }

  clear() {
    if (this.currentUrl && this.currentUrl.startsWith('/uploads/')) {
      this.uploader.deleteByUrl(this.currentUrl).subscribe({ complete: () => {} });
    }
    this.currentUrl = null;
    this.changed.emit(null);
  }

  private handleFile(file: File) {
    this.error = '';
    this.uploading = true;
    this.uploader.uploadImage(file).subscribe({
      next: (res: { url: string }) => { this.uploading = false; this.currentUrl = res.url; this.changed.emit(res.url); },
      error: (e: any) => { this.uploading = false; this.error = e?.error?.message || 'Upload failed'; }
    });
  }
}
