import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthGardService implements CanActivate{

  constructor(private route : Router,private auth: AngularFireAuth) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise( (resolve,rejects) => {
      this.auth.onAuthStateChanged( (user) => {
        if(user){
          resolve(true);
        }else{
          this.route.navigate(['/auth']);
          resolve(false);
        }
      })
    })
  }
}
