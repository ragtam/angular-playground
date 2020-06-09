import { storiesOf } from '@storybook/angular';
import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Component({
    template: `
        <app-menu-item [isRoot]="true" [appMenuFor]="mainMenu"
            >Click Me</app-menu-item
        >

        <ng-template #mainMenu>
            <app-menu>
                <app-menu-item [appMenuFor]="vehiclesSubMenu"
                    >Vehicles</app-menu-item
                >
                <app-menu-item>Cutlery</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #vehiclesSubMenu>
            <app-menu>
                <app-menu-item>Cars</app-menu-item>
                <app-menu-item>Buses</app-menu-item>
                <app-menu-item>Trucks</app-menu-item>
            </app-menu>
        </ng-template>
    `,
})
class HostComponent {}

const moduleMetadata = {
    declarations: [MenuComponent, MenuItemComponent],
};

storiesOf('Menu', module).add('Hello World', () => ({
    moduleMetadata,
    component: HostComponent,
}));
