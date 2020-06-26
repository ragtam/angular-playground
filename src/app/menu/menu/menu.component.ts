import { Component, HostBinding } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
    @HostBinding('style.display') public display = 'inline-block';
    @HostBinding('style.position') public position = 'absolute';

    private menuItem: MenuItemComponent;

    constructor() {}

    public registerOpenedMenu(menuItem: MenuItemComponent): void {
        this.menuItem = menuItem;
    }

    public closeOpenedMenuIfExists(): void {
        if (this.menuItem) {
            this.menuItem.clearContainer();
        }
    }
}
