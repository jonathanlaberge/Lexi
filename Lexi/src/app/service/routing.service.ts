import { Injectable } from '@angular/core';
import { RouteInfo } from './route-info';
import { Subject } from 'rxjs';
import { APIService } from './api.service';

export const RouteEleve: RouteInfo[] =
    [
        { path: 'fiche', title: 'Mes Fiches', icon: 'file', class: '' },
        { path: 'historique', title: 'Mon historique', icon: 'history', class: '' }
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

    public static adminMode: boolean = false;
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

    public static Logout(clearLocalStorage: boolean = true)
    {
        if (clearLocalStorage)
            localStorage.clear();

        APIService.currentMaitresse = null;
        APIService.currentEleve = null;
        APIService.token = null;
        RoutingService.isLoggedIn = false;
        RoutingService.adminMode = false;
        RoutingService.eleveConnected = false;
    }
}
