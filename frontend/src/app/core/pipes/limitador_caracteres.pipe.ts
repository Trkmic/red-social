import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'limitadorCaracteres',
    standalone: true
})
export class LimitadorCaracteresPipe implements PipeTransform {
    transform(value: string, limit = 100): string {
        if (!value) return '';
        return value.length > limit ? value.substring(0, limit) + '...' : value;
    }
}