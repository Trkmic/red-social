import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FormateoHora',
    standalone: true
})
export class FormateoHoraPipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) return '';
        const date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat('es-ES', options).format(date);
    }
}