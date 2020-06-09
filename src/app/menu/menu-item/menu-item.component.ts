import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    TemplateRef,
    Optional,
    OnInit,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuStateService } from '../menu-state.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
    @Input() public appMenuFor: TemplateRef<MenuComponent>;

    @Input() public isRoot: boolean;

    @ViewChild('viewContainerRef', { read: ViewContainerRef })
    public viewContainerRef: ViewContainerRef;

    constructor(
        @Optional() private parent: MenuComponent,
        private menuStateService: MenuStateService
    ) {}

    public ngOnInit(): void {
        if (this.isRoot) {
            this.menuStateService.state$.subscribe((res) => {
                this.viewContainerRef.clear();
            });
        }
    }

    public onClick(evt: Event): void {
        if (this.parent && !this.appMenuFor) {
            this.menuStateService.clearMenu();
            return;
        }

        if (!this.appMenuFor) {
            return;
        }

        if (this.viewContainerRef.length === 0) {
            this.viewContainerRef.createEmbeddedView(this.appMenuFor);
        } else {
            this.clearViewContainer();
        }
    }

    public clearViewContainer(): void {
        this.viewContainerRef.clear();
    }
}
