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
export class MenuItemComponent implements OnDestroy {
    @Input() public appMenuFor: TemplateRef<MenuComponent>;

    @ViewChild('viewContainerRef', { read: ViewContainerRef }) public viewContainerRef: ViewContainerRef;

    public get containerCssClass(): string {
        return this.isRoot() ? 'button__container--parent' : 'button__container--child';
    }

    private boundClickOutsideHandler: (event: any) => void;

    constructor(
        @Optional() private parent: MenuComponent,
        @Inject(WINDOW_REF) private windowRef: Window,
        @Inject(DOCUMENT_REF) private documentRef: Document,
        private menuStateService: MenuStateService
    ) {}

    public ngOnDestroy(): void {
        this.removeClickOutsideListener();
    }

    public onClick(): void {
        if (this.isLeaf()) {
            this.broadcastMenuClear();
        } else if (this.containerIsEmpty()) {
            this.addHandlersForRootElement();
            this.closeAlreadyOpenedMenuInTheSameSubtree();
            this.registerOpenedMenu();
            this.addTemplateToContainer(this.appMenuFor);
        } else {
            this.removeClickOutsideListener();
            this.clearContainer();
        }
    }

    private assingClickOutsideHandler(): void {
        this.boundClickOutsideHandler = this.closeMenuOnOutsideClick.bind(this);
    }

    private registerOpenedMenu(): void {
        if (this.parent) {
            this.parent.registerOpenedMenu(this);
        }
    }

    private addHandlersForRootElement() {
        if (this.isRoot()) {
            this.subscribeToClearMenuMessages();
            this.broadcastMenuClear();
            this.assingClickOutsideHandler();
            this.addClickOutsideListener();
        }
    }

    private closeAlreadyOpenedMenuInTheSameSubtree(): void {
        if (this.parent) {
            this.parent.closeOpenedMenuIfExists();
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
        this.windowRef.addEventListener('click', this.boundClickOutsideHandler);
    }

    private removeClickOutsideListener(): void {
        this.windowRef.removeEventListener('click', this.boundClickOutsideHandler);
    }

    private closeMenuOnOutsideClick({ target }): void {
        const appMenuItem = this.documentRef.querySelector('app-menu-item > app-menu');
        if (appMenuItem && !appMenuItem.parentElement.contains(target)) {
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

    public clearContainer(): void {
        this.viewContainerRef.clear();
    }
}
