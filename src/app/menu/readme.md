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
<app-menu-item [appMenuFor]="main">Click Me</app-menu-item>

<ng-template #main>
    <app-menu>
        <app-menu-item [appMenuFor]="vehicles">Vehicles</app-menu-item>
        <app-menu-item [appMenuFor]="bikes">Bikes</app-menu-item>
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
        <app-menu-item [appMenuFor]="roadBikes">Road</app-menu-item>
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
