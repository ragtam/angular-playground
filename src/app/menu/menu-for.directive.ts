import { Directive, Input, HostListener } from '@angular/core';
import { MenuComponent } from './menu.component';

@Directive({
    selector: '[appMenuFor]',
})
export class MenuForDirective {
    @Input() appMenuFor: MenuComponent;

    constructor() {}

    @HostListener('click')
    public onClick(): void {
        this.appMenuFor.createEmbedeedView();
    }
}
