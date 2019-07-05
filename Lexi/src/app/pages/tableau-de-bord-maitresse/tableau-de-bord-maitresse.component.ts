import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component(
    {
        selector: 'app-tableau-de-bord-maitresse',
        templateUrl: './tableau-de-bord-maitresse.component.html'
    })
export class TableauDeBordMaitresseComponent implements OnInit, OnDestroy
{
    subscriptionURL: Subscription;

    constructor(private router: Router, private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        RoutingService.adminMode = true;
        RoutingService.SetRouteToAdmin();

        this.subscriptionURL = this.activeRoute.url.subscribe(() =>
        {
            if (this.router.url === '/tableaudebord')
            {
                this.router.navigate(['/tableaudebord/eleve']);
            }
        });
    }

    ngOnDestroy()
    {
        if (this.subscriptionURL != null)
            this.subscriptionURL.unsubscribe();
    }
}
