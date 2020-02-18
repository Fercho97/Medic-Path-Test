import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class DoctorGuardService implements CanActivate {
    constructor(public router: Router){

    }

    canActivate() : boolean {
        const userType = sessionStorage.getItem('tipoUsuario');

        if(userType!='2'){
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}