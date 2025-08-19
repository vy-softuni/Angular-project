import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(val: string, max = 120) { if (!val) return ''; return val.length > max ? val.slice(0, max) + '...' : val; }
}
