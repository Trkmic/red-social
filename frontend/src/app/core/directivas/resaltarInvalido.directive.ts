import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appResaltarInvalido]'
})
export class ResaltarInvalidoDirective implements OnInit {
    constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

    ngOnInit() {
        this.control.statusChanges?.subscribe(status => {
        if (status === 'INVALID' && this.control.touched) {
            this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid red');
        } else {
            this.renderer.removeStyle(this.el.nativeElement, 'border');
        }
        });
    }
}