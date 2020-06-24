https://www.freecodecamp.org/news/everything-you-need-to-know-about-ng-template-ng-content-ng-container-and-ngtemplateoutlet-4b7b51223691/

https://medium.com/@pietmichal/angulars-content-projection-trap-and-why-you-should-consider-using-template-outlet-instead-cc3c4cad87c9

https://medium.com/better-programming/understanding-contentchildren-with-an-example-e76ce78968db

https://itnext.io/working-with-angular-5-template-reference-variable-e5aa59fb9af

https://medium.com/swlh/anatomy-of-angular-attribute-directive-selector-a1d83a73242

Building a menu: Angular Material API style

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

First thing we are going to do is to set up Angular app and create a module that will later embrace all elements necessary for the menu to work.

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

Our MenuComponent needs to be positioned absolutely (so that it did not break our document flow) and its display has to be set to inline-block (so that nested tree was displayed next to its parent).

```
...
export class MenuComponent {
    @HostBinding('style.display') public display = 'inline-block';
    @HostBinding('style.position') public position = 'absolute';
...
```

menu.component.ts

Now we have to project the content of our container, making sure that all its elements are displayed in a column, one after another. We do so using <ng-content> tag. Angular replaces this tag with the content that we place between our host component tags. If we put <app-menu>Hello World<app-menu>, it will simply display 'Hello World' in our host component.

```
<div class="menu">
    <ng-content></ng-content>
</div>
```

menu.component.html

```
.menu {
    display: flex;
    flex-direction: column;
}

```

menu.component.css

Having done that, lets concentrate on MenuItemComponent. This component needs to display content of our sub-menu item and, if necessary, trigger display of a nested menu related to it on click. So we are going to project the content using <ng-content> tag again. Also we need to somehow tell our component to display nested submenu related to our menu item. We can do so using <ng-container> tag. This tag is going to act as a placeholder to the template we are going to inject into our MenuItemComponent.

```
<button (click)="onClick()">
    <ng-content></ng-content>
</button>

<ng-container #viewContainerRef></ng-container>
```

menu-item.component.html

We add a template variable 'viewContainerRef' so that we could have a reference in our component class and we also have to define input property for the MenuItemComponent to bind parent item with sub-menu it should trigger. Lets also add a handler for the button click. It will render a template passed into the input property 'menuFor';

```
export class MenuItemComponent implements OnDestroy {
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
