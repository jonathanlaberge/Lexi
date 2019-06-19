import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'dashboard-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    })
export class NavbarComponent implements OnInit
{
    isAdmin = false;
    eleveConnected = false;

    routeSubscription: Subscription;

    constructor() { }

    ngOnInit()
    {
        this.isAdmin = RoutingService.adminMode;
        this.eleveConnected = RoutingService.eleveConnected;

        this.routeSubscription = RoutingService.routeSubject.subscribe((/*route: any[]*/) => 
        {
            this.isAdmin = RoutingService.adminMode;
            this.eleveConnected = RoutingService.eleveConnected;
        })
    }

}
