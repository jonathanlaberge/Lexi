import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'dashboard-sidebar',
        templateUrl: './sidebar.component.html'
    })
export class SidebarComponent implements OnInit
{
    menuItems: any[];

    routeSubscription: Subscription;

    constructor() { }

    ngOnInit()
    {
        this.menuItems = RoutingService.currentRoute.filter(menuItem => menuItem);

        this.routeSubscription = RoutingService.routeSubject.subscribe((route: any[]) => 
        {
            this.menuItems = route.filter(menuItem => menuItem);
        })
    }

}
