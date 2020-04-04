import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {CryptoStorage} from '../../services/shared-service';
@Injectable({
    providedIn: 'root'
})
export class DoctorGuardService implements CanActivate {
    constructor(public router: Router,private storage: CryptoStorage){

    }

    canActivate() : boolean {
        const userType = this.storage.decryptData('tipoUsuario');

        if(userType!='2'){
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}