import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';
import { APIService } from './api.service';
import { Maitresse } from '../model/maitresse';

@Injectable(
    {
        providedIn: 'root'
    })
export class EleveGuard implements CanActivate
{
    constructor(private router: Router, private activeRoute: ActivatedRoute) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        if (RoutingService.isLoggedIn == true && !APIService.IsTokenExpired())
        {
            return true;
        }
        else
        {
            if (localStorage.getItem('maitresseInfo') != null && localStorage.getItem('token') != null)
            {
                APIService.currentMaitresse = JSON.parse(localStorage.getItem('maitresseInfo')) as Maitresse;
                APIService.token = JSON.parse(localStorage.getItem('token'));

                if (!APIService.IsTokenExpired())
                {
                    if (APIService.IsTokenInEleveMode())
                    {
                        RoutingService.isLoggedIn = true;
                        RoutingService.adminMode = false;
                        RoutingService.SetRouteToEleve();

                        this.activeRoute.url.subscribe(() =>
                        {
                            if (this.router.url != '/eleve')
                            {
                                RoutingService.eleveConnected = true;
                            }
                        });

                        return true;
                    }
                    else
                    {
                        this.router.navigate(['/tableaudebord']);
                        return false;
                    }
                }
            }

            RoutingService.Logout(false);
            this.router.navigate(['/connection'],
                {
                    queryParams:
                    {
                        return: state.url
                    }
                });
            return false;
        }
    }

}
