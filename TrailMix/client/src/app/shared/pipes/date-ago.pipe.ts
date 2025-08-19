import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'dateAgo', standalone: true })
export class DateAgoPipe implements PipeTransform {
  transform(value: string | Date) {
    const d = new Date(value);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  }
}
