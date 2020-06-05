import { storiesOf } from '@storybook/angular'
import { Component } from '@angular/core'
import { MenuComponent } from './menu.component'
import { MenuForDirective } from './menu-for.directive'

@Component({
    template: `
        <button [appMenuFor]="mainMenu">Click Me</button>

        <app-menu #mainMenu>
            <button [appMenuFor]="vehiclesSubMenu">Vehicles</button>
            <button>Cutlery</button>
        </app-menu>

        <app-menu #vehiclesSubMenu>
            <button>Cars</button>
            <button>Buses</button>
            <button>Trucks</button>
        </app-menu>
    `,
})
class HostComponent {}

const moduleMetadata = {
    declarations: [MenuComponent, MenuForDirective],
}

storiesOf('Menu', module).add('Hello World', () => ({
    moduleMetadata,
    component: HostComponent,
}))
