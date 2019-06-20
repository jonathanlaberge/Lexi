import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'app-tableau-de-bord-eleve',
        templateUrl: './tableau-de-bord-eleve.component.html',
        styleUrls: ['./tableau-de-bord-eleve.component.css']
    })
export class TableauDeBordEleveComponent implements OnInit
{

    constructor() { }

    ngOnInit()
    {
        RoutingService.adminMode = false;
        RoutingService.SetRouteToEleve();
    }

}
