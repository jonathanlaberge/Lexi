import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';

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
    name = null;
    showLoginModal = false;

    routeSubscription: Subscription;

    constructor(private router: Router) { }

    ngOnInit()
    {
        this.isAdmin = RoutingService.adminMode;
        this.eleveConnected = RoutingService.eleveConnected;
        this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;

        this.routeSubscription = RoutingService.routeSubject.subscribe((/*route: any[]*/) => 
        {
            this.isAdmin = RoutingService.adminMode;
            this.eleveConnected = RoutingService.eleveConnected;
            this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;
        });
    }

    ShowProfile()
    {
        ///////////////////////////////////////////////////////////////////////////////////////////////
    }
    GoToTableauDeBord()
    {
        if (RoutingService.adminMode)
            this.router.navigate(['/tableaudebord']);
        else
            this.showLoginModal = true;
    }
    GoToElevePortail()
    {
        APIService.token = null;
        this.router.navigate(['/eleve']);
    }

    Logout()
    {
        localStorage.clear();
        APIService.currentMaitresse = null;
        APIService.currentEleve = null;
        APIService.token = null;
        RoutingService.isLoggedIn = false;
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = false;

        this.router.navigate(['/']);
    }
}
