import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'app-eleve-fiche',
        templateUrl: './eleve-fiche.component.html',
        styleUrls: ['./eleve-fiche.component.css']
    })
export class EleveFicheComponent implements OnInit
{

    constructor(private router: Router, private apiService: APIService) { }

    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = true;
        RoutingService.SetRouteToEleve();

        if (!APIService.IsTokenInEleveMode())
            this.router.navigate(['/eleve']);
    }


}
