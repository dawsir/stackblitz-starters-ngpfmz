import { Directive, ElementRef, inject, input, InputSignal, OnChanges } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appBoldMatchingText]',
})
export class BoldMatchingTextDirective implements OnChanges {
    public searchTerm: InputSignal<string> = input<string>('');
    public text: InputSignal<string> = input<string>('');

    private readonly el = inject(ElementRef);

    ngOnChanges() {
        if (this.searchTerm()) {
            const regex = new RegExp(`(${this.searchTerm()})`, 'gi');
            this.el.nativeElement.innerHTML = this.text().replace(regex, '<strong>$1</strong>');
        } else {
            this.el.nativeElement.textContent = this.text();
        }
    }
}
