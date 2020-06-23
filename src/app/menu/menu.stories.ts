import { storiesOf } from '@storybook/angular';
import { Component } from '@angular/core';
import { MenuModule } from './menu.module';

@Component({
    template: `
        <app-menu-item [appMenuFor]="main">Click Me</app-menu-item>

        <ng-template #main>
            <app-menu>
                <app-menu-item [appMenuFor]="vehicles">Vehicles</app-menu-item>
                <app-menu-item [appMenuFor]="bikes">Bikes</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #vehicles>
            <app-menu>
                <app-menu-item>Cars</app-menu-item>
                <app-menu-item>Buses</app-menu-item>
                <app-menu-item>Trucks</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #bikes>
            <app-menu>
                <app-menu-item [appMenuFor]="roadBikes">Road</app-menu-item>
                <app-menu-item>MTB</app-menu-item>
                <app-menu-item>City</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #roadBikes>
            <app-menu>
                <app-menu-item>Race</app-menu-item>
                <app-menu-item>Gravel</app-menu-item>
                <app-menu-item>Aero</app-menu-item>
                <app-menu-item>Time Trial</app-menu-item>
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
