import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';

@Component(
    {
        selector: 'dashboard-navbar',
        templateUrl: './navbar.component.html'
    })
export class NavbarComponent implements OnInit
{
    isAdmin: boolean = false;
    eleveConnected: boolean = false;
    showLoginModal: boolean = false;

    errorServer: boolean = false;
    errorLogin: boolean = false;

    name: string = null;

    loginPassword: string = null;
    loginIsReady: boolean = false;

    routeSubscription: Subscription;

    constructor(private router: Router, private apiService: APIService) { }

    ngOnInit()
    {
        this.isAdmin = RoutingService.adminMode;
        this.eleveConnected = RoutingService.eleveConnected;
        this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;

        this.routeSubscription = RoutingService.routeSubject.subscribe(() => 
        {
            this.isAdmin = RoutingService.adminMode;
            this.eleveConnected = RoutingService.eleveConnected;
            this.name = `${APIService.currentMaitresse.prenom} ${APIService.currentMaitresse.nom}`;
        });
    }

    ShowProfile()
    {
        console.log(APIService.token); ///////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////
    }

    GoToTableauDeBord()
    {
        if (APIService.IsTokenInAdminMode())
            this.router.navigate(['/tableaudebord']);
        else
            this.showLoginModal = true;
    }

    SubmitAdminMode()
    {
        var args = { motdepasse: this.loginPassword };

        this.apiService.Mode(args).subscribe(
            (data: any) =>
            {
                if (data.token != null)
                {
                    APIService.token = data.token;
                    localStorage.setItem('token', JSON.stringify(APIService.token));
                    RoutingService.adminMode = true;
                    RoutingService.eleveConnected = false;
                    RoutingService.SetRouteToAdmin();
                    this.errorServer = false;
                    this.loginIsReady = true;
                    this.router.navigate(['/tableaudebord']);
                }
                else
                {
                    this.errorServer = true;
                    this.loginIsReady = true;
                }
                
            },
            error =>
            {
                if (error.status == 401)
                    this.errorLogin = true;
                else
                    this.errorServer = true;

                this.loginIsReady = true;
            });
    }

    GoToElevePortail()
    {
        this.router.navigate(['/eleve']);
    }

    Logout()
    {
        RoutingService.Logout();

        this.router.navigate(['/']);
    }
}
