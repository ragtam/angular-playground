import { storiesOf } from '@storybook/angular';
import { Component } from '@angular/core';
import { MenuModule } from './menu.module';

@Component({
    template: `
        <app-menu-item [appMenuFor]="mainMenu">Click Me</app-menu-item>

        <ng-template #mainMenu>
            <app-menu>
                <app-menu-item [appMenuFor]="vehiclesSubMenu">Vehicles</app-menu-item>
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
    imports: [MenuModule],
};

storiesOf('Menu', module).add('Should Work', () => ({
    moduleMetadata,
    component: HostComponent,
}));
