import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MenuStateService {
    public _state = new Subject<any>();

    public state$ = this._state.asObservable();

    constructor() {}

    public clearMenu(): void {
        this._state.next();
    }
}
