import {
    Component,
    OnInit,
    HostBinding,
    ViewContainerRef,
    ViewChild,
    TemplateRef,
    ViewChildren,
    QueryList,
    ContentChildren,
} from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;

    constructor(private viewContainerRef: ViewContainerRef) {}

    ngOnInit(): void {}

    public createEmbedeedView(): void {
        if (this.viewContainerRef.length === 0) {
            this.viewContainerRef.createEmbeddedView(this.tpl);
        } else {
            this.viewContainerRef.clear();
        }
    }
}
