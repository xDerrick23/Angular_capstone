import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private authSrv: AuthService, private router:Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authSrv.currentUser$.pipe(
            take(1),
            map((user)=>{
                if(user){
                    return true;
                }
                alert('Non hai i permessi per visualizzare questo contenuto, effettua il login')
                return this.router.createUrlTree(['']);
            })
        );
    }
}
