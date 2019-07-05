import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';
import { APIService } from 'src/app/service/api.service';
import { Eleve } from 'src/app/model/eleve';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component(
    {
        selector: 'app-tableau-de-bord-eleve',
        templateUrl: './tableau-de-bord-eleve.component.html',
        styleUrls: ['./tableau-de-bord-eleve.component.css']
    })
export class TableauDeBordEleveComponent implements OnInit, OnDestroy
{
    elevesList: Eleve[] = [];
    isReady: boolean = false;

    errorServer: boolean = false;

    subscriptionAdminControllerUserGetList: Subscription;
    subscriptionAccountControllerMode: Subscription;
    subscriptionURL: Subscription;

    constructor(
        private apiService: APIService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private ref: ChangeDetectorRef) { }

    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.SetRouteToEleve();

        this.subscriptionURL = this.activeRoute.url.subscribe(() =>
        {
            if (this.router.url === '/eleve')
            {
                RoutingService.eleveConnected = false;
            }
            RoutingService.EmitRouteSubject();
            this.ref.detectChanges();
        });

        this.subscriptionAdminControllerUserGetList =
            this.apiService.AdminController_UserGetList(0).subscribe(
                (data: any) =>
                {
                    if (data != null)
                        data.forEach(function (value)
                        {
                            this.elevesList.push(value as Eleve);
                        }.bind(this));

                    this.isReady = true;
                    this.ref.detectChanges();
                },
                () =>
                {
                    this.errorServer = true;
                    this.isReady = true;
                });
    }

    ngOnDestroy()
    {
        if (this.subscriptionAdminControllerUserGetList != null)
            this.subscriptionAdminControllerUserGetList.unsubscribe();

        if (this.subscriptionAccountControllerMode != null)
            this.subscriptionAccountControllerMode.unsubscribe();

        if (this.subscriptionURL != null)
            this.subscriptionURL.unsubscribe();
    }

    IsShowingPortail()
    {
        return this.router.url === '/eleve';
    }

    SelectEleve(idEleve: number)
    {
        this.isReady = false;

        this.subscriptionAccountControllerMode =
            this.apiService.AccountController_Mode({ idEleveEnCours: idEleve }).subscribe(
                (data: any) =>
                {
                    if (data.token != null)
                    {
                        APIService.token = data.token;
                        localStorage.setItem('token', JSON.stringify(APIService.token));
                        RoutingService.adminMode = false;
                        RoutingService.eleveConnected = true;
                        RoutingService.SetRouteToEleve();
                        this.errorServer = false;
                        this.isReady = true;
                        this.router.navigate(['/eleve/fiche']);
                    }
                    else
                    {
                        this.errorServer = true;
                        this.isReady = true;
                    }

                    this.ref.detectChanges();
                },
                () =>
                {
                    this.errorServer = true;
                    this.isReady = true;
                });
    }
}
