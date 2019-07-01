import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component(
    {
        selector: 'app-tableau-de-bord-maitresse',
        templateUrl: './tableau-de-bord-maitresse.component.html'
    })
export class TableauDeBordMaitresseComponent implements OnInit
{

    constructor(private router: Router, private activeRoute: ActivatedRoute) { }

    ngOnInit()
    {
        RoutingService.adminMode = true;
        RoutingService.SetRouteToAdmin();

        this.activeRoute.url.subscribe(() =>
        {
            if (this.router.url === '/tableaudebord')
            {
                this.router.navigate(['/tableaudebord/eleve']);
            }
        });
    }

}
