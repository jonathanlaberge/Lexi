import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from './routing.service';

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
        if (RoutingService.isLoggedIn == true && RoutingService.adminMode == true)
        {
            return true;
        }
        else
        {
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
