import { Injectable } from '@angular/core';
import { RouteInfo } from './route-info';
import { Subject } from 'rxjs';

export const RouteEleve: RouteInfo[] =
    [
        { path: 'fiche', title: 'Fiche', icon: 'file', class: '' },
        { path: 'historique', title: 'Register', icon: 'history', class: '' }
    ];

export const RouteAdmin: RouteInfo[] =
    [
        { path: 'eleve', title: 'Liste des élèves', icon: 'user', class: '' },
        { path: 'qcm', title: 'Gestion des questionnaires', icon: 'view-list', class: '' }
    ];

@Injectable(
    {
        providedIn: 'root'
    })
export class RoutingService
{
    public static isLoggedIn: boolean = false;

    public static adminMode: boolean = true;
    public static eleveConnected: boolean = false;

    public static routeSubject = new Subject<RouteInfo[]>();
    public static currentRoute: RouteInfo[] = RouteAdmin;

    constructor() { }
    
    private static EmitRouteSubject()
    {
        RoutingService.routeSubject.next(this.currentRoute.slice());
    }

    public static SetRouteToEleve()
    {
        this.currentRoute = RouteEleve;
        RoutingService.EmitRouteSubject();
    }

    public static SetRouteToAdmin()
    {
        this.currentRoute = RouteAdmin;
        RoutingService.EmitRouteSubject();
    }
}
