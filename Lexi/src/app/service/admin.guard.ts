import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';
import { APIService } from './api.service';
import { Maitresse } from '../model/maitresse';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate
{
    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        if (RoutingService.isLoggedIn == true && !APIService.IsTokenExpired())
        {
            if (APIService.IsTokenInAdminMode())
                return true;
            else
            {
                this.router.navigate(['/eleve']);
                return false;
            }
        }
        else
        {
            if (localStorage.getItem('maitresseInfo') != null && localStorage.getItem('token') != null)
            {
                APIService.currentMaitresse = JSON.parse(localStorage.getItem('maitresseInfo')) as Maitresse;
                APIService.token = JSON.parse(localStorage.getItem('token'));

                if (!APIService.IsTokenExpired())
                    if (APIService.IsTokenInAdminMode())
                    {
                        RoutingService.isLoggedIn = true;
                        RoutingService.adminMode = true;
                        RoutingService.SetRouteToAdmin();
                        return true;
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
