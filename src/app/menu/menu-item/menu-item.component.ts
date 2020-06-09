import { Component, ViewChild, ViewContainerRef, Input, TemplateRef, Optional, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuStateService } from '../menu-state.service';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
    @Input() public appMenuFor: TemplateRef<MenuComponent>;

    @ViewChild('viewContainerRef', { read: ViewContainerRef }) public viewContainerRef: ViewContainerRef;

    constructor(@Optional() private parent: MenuComponent, private menuStateService: MenuStateService) {}

    public ngOnInit(): void {
        if (this.isRoot()) {
            this.subscribeToClearMenuMessages();
        }
    }

    public onClick(): void {
        if (this.isLeaf()) {
            this.broadcastMenuClear();
        } else if (this.containerIsEmpty()) {
            this.addTemplateToContainer(this.appMenuFor);
        } else {
            this.clearContainer();
        }
    }

    private isRoot(): boolean {
        return isNullOrUndefined(this.parent);
    }

    private subscribeToClearMenuMessages(): void {
        this.menuStateService.state$.subscribe(() => {
            this.clearContainer();
        });
    }

    private isLeaf(): boolean {
        return !this.isRoot() && !this.hasNestedSubMenu();
    }

    private hasNestedSubMenu(): boolean {
        return !!this.appMenuFor;
    }

    private broadcastMenuClear(): void {
        this.menuStateService.clearMenu();
    }

    private containerIsEmpty(): boolean {
        return this.viewContainerRef.length === 0;
    }

    private addTemplateToContainer(template: TemplateRef<any>): void {
        this.viewContainerRef.createEmbeddedView(template);
    }

    private clearContainer(): void {
        this.viewContainerRef.clear();
    }
}
