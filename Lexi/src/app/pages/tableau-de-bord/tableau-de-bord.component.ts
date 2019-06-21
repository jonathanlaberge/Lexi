import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/service/routing.service';

@Component(
    {
        selector: 'app-tableau-de-bord',
        templateUrl: './tableau-de-bord.component.html',
        styleUrls: ['./tableau-de-bord.component.css']
    })
export class TableauDeBordComponent implements OnInit
{

    constructor() { }

    ngOnInit()
    {
        RoutingService.adminMode = true;
        RoutingService.SetRouteToAdmin();
    }

}
