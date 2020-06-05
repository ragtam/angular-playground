import {
    Directive,
    Input,
    HostListener,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { MenuComponent } from './menu.component';

@Directive({
    selector: '[appMenuFor]',
})
export class MenuForDirective implements OnChanges {
    @Input() appMenuFor: MenuComponent;

    private componentsArray: Array<MenuComponent> = [];

    public ngOnChanges(sc: SimpleChanges): void {
        this.componentsArray.push(sc.appMenuFor.currentValue);
    }

    @HostListener('click')
    public onClick(): void {
        console.log(this.componentsArray.length);

        if (this.appMenuFor.isVisible()) {
            this.appMenuFor.hide();
        } else {
            this.appMenuFor.show();
        }
    }
}
