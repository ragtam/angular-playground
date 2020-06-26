import { storiesOf } from '@storybook/angular';
import { Component } from '@angular/core';
import { MenuModule } from './menu.module';

@Component({
    template: `
        <app-menu-item [menuFor]="main">Click Me</app-menu-item>

        <ng-template #main>
            <app-menu>
                <app-menu-item [menuFor]="vehicles">Vehicles</app-menu-item>
                <app-menu-item [menuFor]="bikes">Bikes</app-menu-item>
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
                <app-menu-item [menuFor]="roadBikes">Road</app-menu-item>
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

        <h1>hello world</h1>

        <app-menu-item [menuFor]="main0">Click Me</app-menu-item>

        <ng-template #main0>
            <app-menu>
                <app-menu-item [menuFor]="vehicles0">Vehicles 0</app-menu-item>
                <app-menu-item [menuFor]="bikes0">Bikes 0</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #vehicles0>
            <app-menu>
                <app-menu-item>Cars 0</app-menu-item>
                <app-menu-item>Buses 0</app-menu-item>
                <app-menu-item>Trucks 0</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #bikes0>
            <app-menu>
                <app-menu-item [menuFor]="roadBikes0">Road 0</app-menu-item>
                <app-menu-item>MTB 0</app-menu-item>
                <app-menu-item>City 0</app-menu-item>
            </app-menu>
        </ng-template>

        <ng-template #roadBikes0>
            <app-menu>
                <app-menu-item>Race 0</app-menu-item>
                <app-menu-item>Gravel 0</app-menu-item>
                <app-menu-item>Aero 0</app-menu-item>
                <app-menu-item>Time Trial 0</app-menu-item>
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
