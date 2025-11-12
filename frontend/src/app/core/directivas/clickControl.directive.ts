import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appClickControl]'
})
export class ClickControlDirective {
    @Input() debounceTime = 500;
    private isClicked = false;

    @HostListener('click', ['$event'])
    clickEvent(event: Event) {
        if (this.isClicked) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
        }

        this.isClicked = true;
        setTimeout(() => {
        this.isClicked = false;
        }, this.debounceTime);
    }
}