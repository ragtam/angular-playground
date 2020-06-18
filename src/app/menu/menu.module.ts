import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuStateService } from './menu-state.service';
import { WINDOW_REF, DOCUMENT_REF } from './injection-tokens';

@NgModule({
    declarations: [MenuComponent, MenuItemComponent],
    providers: [MenuStateService, { provide: WINDOW_REF, useValue: window }, { provide: DOCUMENT_REF, useValue: document }],
    imports: [CommonModule],
    exports: [MenuComponent, MenuItemComponent],
})
export class MenuModule {}
