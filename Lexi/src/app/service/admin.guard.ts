import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';
import { APIService } from './api.service';

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
            if (RoutingService.adminMode == true)
                return true;
            else
            {
                this.router.navigate(['/eleve']);
                return false;
            }
        }
        else
        {
            RoutingService.Logout();
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
