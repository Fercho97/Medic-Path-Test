import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {TokenService} from '../../services/token-service';
@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
    constructor(public router: Router, private tokenServ : TokenService){

    }

    canActivate() : boolean {
        const userType = this.tokenServ.getRole();
        //this.storage.decryptData('tipoUsuario');
        if(userType!='3'){
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}