# Building a context menu: Angular Material API style

In this article we will learn how to build a generic menu with Angular Material like API style.
We are going to concentrate on its logic, without paying too much attention to the way its presented on the screen.

Our goal is to create a menu, items of which could be defined in a way shown below, so that we could have as many subtrees as we want without having to nest them.

```
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
        <app-menu-item>Road</app-menu-item>
        <app-menu-item>MTB</app-menu-item>
        <app-menu-item>City</app-menu-item>
    </app-menu>
</ng-template>
```

## Setup

First thing we are going to do is to set up an Angular app and create a module that will later embrace all elements necessary for the menu to work.

```
ng new menu-demo-app
cd menu-demo-app
ng generate module menu
```

Now we are going to create two components, one that is going to act as a container for menu items on each subtree level ( <app-menu></app-menu> ) and the other for each menu item ( <app-menu-item></app-menu-item> ). Former being a container for the latter.

```
ng generate component menu/menu
ng generate component menu/menu-item

```

We need to make sure that both components are declared and exported in MenuModule.ts. It should look this way:

```
@NgModule({
  declarations: [MenuComponent, MenuItemComponent],
  exports: [MenuComponent, MenuItemComponent],
  imports: [CommonModule],
})
export class MenuModule {}
```

menu.module.ts

## Styling the Menu (container for items)

Our MenuComponent needs to be positioned absolutely (so that it did not break our document flow) and its display has to be set to inline-block (so that nested tree was displayed next to its parent).

```
...
export class MenuComponent {
    @HostBinding('style.display') public display = 'inline-block';
    @HostBinding('style.position') public position = 'absolute';
...
```

menu.component.ts

Now we have to project the content of our container. It can be done using <ng-content> tag. Angular replaces this tag with the content that we place between our host component tags. If we put <app-menu>Hello World<app-menu>, it will simply display 'Hello World' in our host component.

```
<div class="menu">
    <ng-content></ng-content>
</div>
```

menu.component.html

We wrap projected content around a div and add some styling to it so that all projected elements (menu items) were displayed in one column, one below another.

```
.menu {
    display: flex;
    flex-direction: column;
}

```

menu.component.css

## Building Menu Item component

Having done that, let's concentrate on MenuItemComponent. This component needs to display the content of our sub-menu item and, if necessary, trigger display of a nested menu related to it on click. We are going to project the content using <ng-content> tag again. Also we need to tell the component to display nested submenu that is related to the menu item. We can do so using <ng-container> tag. This tag is going to act as a placeholder to the template we are going to inject into our MenuItemComponent.

```
<button (click)="onClick()" class="button__container">
    <ng-content></ng-content>
</button>

<ng-container #viewContainerRef></ng-container>
```

menu-item.component.html

```
.button__container {
  min-width: 110px;
}
```

menu-item.component.css

We add a template variable 'viewContainerRef' so that we could have a reference in our component class. We have to define input property for the MenuItemComponent to bind parent item with sub-menu it should trigger. We will add a css style, so that all button elements had the same width. Now lets add a handler for the button click. It will render a template passed into the input property 'menuFor'.

```
export class MenuItemComponent {
    @Input() public menuFor: TemplateRef<MenuComponent>;

    @ViewChild('viewContainerRef', { read: ViewContainerRef }) public viewContainerRef: ViewContainerRef;

    constructor() {}

    public onClick(): void {
        this.addTemplateToContainer(this.menuFor);
    }

    private addTemplateToContainer(template: TemplateRef<any>): void {
        this.viewContainerRef.createEmbeddedView(template);
    }
```

menu-item.component.ts

ViewContainerRef represents a container to which we can attatch a view. In our case we are going to attach the view that was passed into our menuFor input property. To do so, we use createEmbedeedView method existing on ViewContainerRef, which does the actual insertion of a view into our container.

## See it Working

At that moment we should be able to see a nested menu after clicking on a parent element. But before that we have to set up a playground for that. Lets add MenuModule to imports array in AppModule, and also add menu html with some sub items inside to AppComponent template.

```
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MenuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

app.module.ts

```
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
```

app.component.html

If you have run the app and checked how it works, you must have spotted some problems (not full list).

1. the first menu container should be displayed below 'Click Me' button,
2. its impossible to close menu on clicking menu item button,
3. clicking outside the menu should close it too, but it doesn't.

## Fix positioning of Menu Container

Lets tackle the first problem. Menu Item element needs to know if it's the very root of the menu tree, or if it's a leaf. Depending on its position in the tree we are going to apply different CSS style to it. To find it out we need to inject optional dependency to our MenuItemComponent, which is going to be a parent component. If there is no parent component of type MenuComponent, it means the MenuItem is the root, otherwise it's the leaf. Lest add two css classes for the parent and the child:

```
.button__container {
    min-width: 110px;
}

.button__container--root {
    display: block;
}

.button__container--leaf {
    margin-left: 1px;
    display: inline-block;
    border: 1px solid grey;
}

```

menu-item.component.css

Once we have them we need to add a getter function, which is going to return either of them depending on its position in menu tree:

```
    public get containerCssClass(): string {
        return this.isRoot() ? 'button__container--root' : 'button__container--leaf';
    }

    constructor( @Optional() private parent: MenuComponent ) {}

    private isRoot(): boolean {
        return isNullOrUndefined(this.parent);
    }
```

menu-item.component.ts

One last thing is to alter menu item html a bit, so that it accepted dynamically assigned css class. After a change it should look like this:

```
<button (click)="onClick()" [ngClass]="containerCssClass" class="button__container">
    <ng-content></ng-content>
</button>

<ng-container #viewContainerRef></ng-container>
```

menu-item.component.html

## Opening and Closing on menu item click

Problem number one, checked. Now lets concentrate on another. We click 'Click Me' button, menu is displayed, clicking on it again should close it. But it does not. To solve that let's check if the placeholder for our container is already taken up by another menu. If so it means we need to clear the container. Let's alter the 'onClick' handler and add two private methods.

```
    public onClick(): void {
        if (this.containerIsEmpty()) {
            this.addTemplateToContainer(this.menuFor);
        } else {
            this.clearContainer();
        }
    }

    private containerIsEmpty(): boolean {
        return this.viewContainerRef.length === 0;
    }

    private clearContainer(): void {
        this.viewContainerRef.clear();
    }

```

menu-item.component.ts

If we click 'Click Me' button the menu shows up, click again and it disapears. Seems to have helped. But still we need to close sub tree if we click on a leaf that is adjascent to its parent. To do so we need to alter MenuComponent, so that it knew which menu item triggered sub menu open. And also to make it capable of telling the menu item to clear its content (close sub menu that it opened). Let's add those two methods then. After the change our MenuComponent should look like this:

```
export class MenuComponent {
    @HostBinding('style.display') public display = 'inline-block';
    @HostBinding('style.position') public position = 'absolute';

    private activeMenuItem: MenuItemComponent;

    constructor() {}

    public registerOpenedMenu(menuItem: MenuItemComponent): void {
        this.activeMenuItem = menuItem;
    }

    public closeOpenedMenuIfExists(): void {
        if (this.activeMenuItem) {
            this.activeMenuItem.clearContainer();
        }
    }
}
```

menu.component.ts

Now lets go to MenuItemComponent. We need to change the accessor of clearContainer method to be public, and handle registration of opened sub menu in our parent component. Now in 'onClick' we first close already opened menu (if exists), then register menu item that triggered another menu to open. Altered click handler, clickContainer and new private methods added should look like this.

```
    public onClick(): void {
        if (this.containerIsEmpty()) {
            this.closeAlreadyOpenedMenuInTheSameSubtree();
            this.registerOpenedMenu();
            this.addTemplateToContainer(this.menuFor);
        } else {
            this.clearContainer();
        }
    }

    public clearContainer(): void {
        this.viewContainerRef.clear();
    }

    private closeAlreadyOpenedMenuInTheSameSubtree(): void {
        if (this.parent) {
            this.parent.closeOpenedMenuIfExists();
        }
    }

    private registerOpenedMenu(): void {
        if (this.parent) {
            this.parent.registerOpenedMenu(this);
        }
    }

```

## Closing on the click outside

Ok, seems we are done with that. Now we need to close our menu if we click outside of it (problem number three). To detect if click happened outside we are going to use window and document objects. We will use window`s add/remove click handlers and document to query menu item. We don't want to use global objects as they are inconvenient to mock in testing, this is why we are going to create injection tokens for them. Lets create a file name injection-tokens.ts in the root of our menu ( next to menu.module.ts).

```
import { InjectionToken } from '@angular/core';

export const WINDOW_REF = new InjectionToken<Window>('windowRef');

export const DOCUMENT_REF = new InjectionToken<Document>('documentRef');
```

injection-tokens.ts

Once we have them, lets provide them in MenuModule, at this point the file should look like this:

```
@NgModule({
    declarations: [MenuComponent, MenuItemComponent],
    providers: [
        {
            provide: WINDOW_REF,
            useValue: window
        },
        {
            provide: DOCUMENT_REF,
            useValue: document
        }
    ],
    imports: [CommonModule],
    exports: [MenuComponent, MenuItemComponent],
})
export class MenuModule {}
```

menu.module.ts

Now lets make use of our tokens and inject them in MenuItemComponent. Its constructor should be extended with two items, windowRef and documentRef. With the use of those objects we are going to detect if click happened outside of the menu. We will attach click listener to the root element of our menu (as all sub menus are added as its children). Once menu is closed we will remove the listener. Lets add some more code to our menu item.

```
    private boundClickOutsideHandler: (event: any) => void;

    constructor(
        @Optional() private parent: MenuComponent,
        @Inject(WINDOW_REF) private windowRef: Window,
        @Inject(DOCUMENT_REF) private documentRef: Document
    ) {}

    ...

    public onClick(): void {
        if (this.containerIsEmpty()) {
            // we add a handler for the root element
            this.addHandlersForRootElement();

            this.closeAlreadyOpenedMenuInTheSameSubtree();
            this.registerOpenedMenu();
            this.addTemplateToContainer(this.menuFor);
        } else {
            // and remove it in case we want to close the menu
            this.removeClickOutsideListener(this.boundClickOutsideHandler);

            this.clearContainer();
        }
    }

    ...

    private addHandlersForRootElement() {
        if (this.isRoot()) {
            this.assingClickOutsideHandler();
            this.addClickOutsideListener(this.boundClickOutsideHandler);
        }
    }

    private assingClickOutsideHandler(): void {
        this.boundClickOutsideHandler = this.closeMenuOnOutsideClick.bind(this);
    }

    private addClickOutsideListener(functionRef: () => void): void {
        this.windowRef.addEventListener('click', functionRef);
    }

    private removeClickOutsideListener(functionRef: () => void): void {
        this.windowRef.removeEventListener('click', functionRef);
    }

    private closeMenuOnOutsideClick({ target }): void {
        // currently just a placeholder
        console.log('hello world');
    }

```

menu-item.component.ts

If we click on the menu which submenu is currently closed, before showing it we check if it was the root element, and if so we add click event listener. If on the other hand menu is already visible and we click it again, we need to remove click listener and only then proceed with clearing the container. You probably have noticed new private property boundClickOutsideHandler and that its passed in as a second argument of addEventListener (not just closeMenuOnOustideClick). This is done, because removeEventListener checks by reference the function that it needs to remove. Doing 'closeMenuOnOustideClick.bind(this)' returns a new reference, and so does an arrow function. This is why we need to assign function reference to a property.

With handlers attatched we can work on closing the menu on outside click. We are going to use querySelector to get the root menu. If clicked target was outside of it, we remove click handler and broadcast menu clear. BroadcastMenuClear is a method that we need to define.

```
    private closeMenuOnOutsideClick({ target }): void {
        const appMenuItem = this.documentRef.querySelector('app-menu-item > app-menu');
        if (appMenuItem && !appMenuItem.parentElement.contains(target)) {
            this.removeClickOutsideListener(this.boundClickOutsideHandler);
            this.broadcastMenuClear();
        }
    }

    private broadcastMenuClear(): void {
        // a placeholder
    }
```

menu-item.component.ts

Its going to call a service that is responsible for informing everyone who is interested that a menu should be closed. Lets create a service then. Type 'ng generate service menu/menuState' and hit enter. After that lets expose an observable and define a method that will make it fire next value.

```
@Injectable({
    providedIn: 'root',
})
export class MenuStateService {
    public state$: Observable<void>;

    private _state = new Subject<any>();

    constructor() {
        this.state$ = this._state.asObservable();
    }

    public clearMenu(): void {
        this._state.next();
    }
}
```

Once we have a service, we need to use it in MenuItemComponent. Lets go to broadcastMenuClear method, and call clear menu from menu state service. We are now dispatching next on the observable, but no one is listening to the messages. Lets add a method that will subscribe to the messages. We will call it subscribeToClearMenuMessages, and add it to addHandlersForRootElement.

```
    constructor(
        @Optional() private parent: MenuComponent,
        @Inject(WINDOW_REF) private windowRef: Window,
        @Inject(DOCUMENT_REF) private documentRef: Document,
        private menuStateService: MenuStateService
    ) {}

    ...

    // altered addHandlersForRootElement method
    private addHandlersForRootElement() {
        if (this.isRoot()) {
            // we subscribe to menu state changes in here
            this.subscribeToClearMenuMessages();
            this.assingClickOutsideHandler();
            this.addClickOutsideListener(this.boundClickOutsideHandler)
        }
    }

    ...

    private broadcastMenuClear(): void {
        this.menuStateService.clearMenu();
    }

    ...

    private subscribeToClearMenuMessages(): void {
        this.menuStateService.state$.subscribe(() => {
            this.clearContainer();
        });
    }
```

menu-item.component.ts

Our menu is almost working, now we have to handle its leaves. If a leaf has been clicked, we need to close the menu. Lets change our click method.

```
   public onClick(): void {
        if (this.isLeaf()) {
            this.broadcastMenuClear();
        } else if (this.containerIsEmpty()) {
            this.addHandlersForRootElement();
            this.closeAlreadyOpenedMenuInTheSameSubtree();
            this.registerOpenedMenu();
            this.addTemplateToContainer(this.menuFor);
        } else {
            this.removeClickOutsideListener(this.boundClickOutsideHandler);
            this.clearContainer();
        }
    }

    ...

    private isLeaf(): boolean {
        return !this.isRoot() && !this.hasNestedSubMenu();
    }

    private hasNestedSubMenu(): boolean {
        return !!this.menuFor;
    }
```

One last thing is cleaning up. Lets add ngOnDestroy to MenuItemComponent and remove click outside listener.

```
export class MenuItemComponent implements OnDestroy {

    ...

    // new private property
    private menuStateSubscription: Subscription;
    ...

    public ngOnDestroy(): void {
        this.removeClickOutsideListener(this.boundClickOutsideHandler);
        this.unsubscribe();
    }

    ...

    // updated subscribeToClearMenuMessages method
    private subscribeToClearMenuMessages(): void {
        this.menuStateSubscription = this.menuStateService.state$.subscribe(() => {
            this.clearContainer();
        });
    }

    // added unsubscribe method
    private unsubscribe(): void {
        if (this.menuStateSubscription) {
            this.menuStateSubscription.unsubscribe();
        }
    }
```

## Conclusion

In this article we learnt how to build a context menu with the API similar to the one Angular Material uses. We applied several techniques used during Angular application creation, like content projection, created views from templates dynamically, accessed parent of a child component and applied styles dynamically.

## Resources

https://www.freecodecamp.org/news/everything-you-need-to-know-about-ng-template-ng-content-ng-container-and-ngtemplateoutlet-4b7b51223691/

https://medium.com/@pietmichal/angulars-content-projection-trap-and-why-you-should-consider-using-template-outlet-instead-cc3c4cad87c9

https://medium.com/better-programming/understanding-contentchildren-with-an-example-e76ce78968db

https://itnext.io/working-with-angular-5-template-reference-variable-e5aa59fb9af

https://medium.com/swlh/anatomy-of-angular-attribute-directive-selector-a1d83a73242
