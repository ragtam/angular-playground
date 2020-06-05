import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    @HostBinding('style.display') public display = 'none'

    constructor() {}

    ngOnInit(): void {}

    public show(): void {
        this.display = 'block'
    }

    public hide(): void {
        this.display = 'none'
    }

    public isVisible(): boolean {
        return this.display === 'block'
    }
}
