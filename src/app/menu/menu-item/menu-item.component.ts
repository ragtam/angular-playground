import { Component, ViewChild, ViewContainerRef, Input, TemplateRef, Optional, OnInit, OnDestroy, Inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuStateService } from '../menu-state.service';
import { isNullOrUndefined } from 'util';
import { WINDOW_REF, DOCUMENT_REF } from '../injection-tokens';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit, OnDestroy {
    @Input() public appMenuFor: TemplateRef<MenuComponent>;

    @ViewChild('viewContainerRef', { read: ViewContainerRef }) public viewContainerRef: ViewContainerRef;

    public get containerCssClass(): string {
        return this.isRoot() ? 'button__container--parent' : 'button__container--child';
    }

    constructor(
        @Optional() private parent: MenuComponent,
        @Inject(WINDOW_REF) private windowRef: Window,
        @Inject(DOCUMENT_REF) private documentRef: Document,
        private menuStateService: MenuStateService
    ) {}

    public ngOnInit(): void {
        if (this.isRoot()) {
            this.subscribeToClearMenuMessages();
            this.addClickOutsideListener();
        }
    }

    public ngOnDestroy(): void {
        this.removeClickOutsideListener();
    }

    public onClick(): void {
        if (this.isLeaf()) {
            this.broadcastMenuClear();
        } else if (this.containerIsEmpty()) {
            this.addTemplateToContainer(this.appMenuFor);
        } else {
            this.removeClickOutsideListener();
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

    private addClickOutsideListener(): void {
        this.windowRef.addEventListener('click', this.closeMenuOnOutsideClick.bind(this));
    }

    private removeClickOutsideListener(): void {
        this.windowRef.removeEventListener('click', this.closeMenuOnOutsideClick.bind(this));
    }

    private closeMenuOnOutsideClick(e: any): void {
        const menuItemsCollection = this.documentRef.getElementsByTagName('app-menu-item');
        if (!menuItemsCollection || menuItemsCollection.length === 0) {
            return;
        } else if (!menuItemsCollection[0].contains(e.target)) {
            this.removeClickOutsideListener();
            this.broadcastMenuClear();
        }
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
