import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TokenService{

    constructor(){

    }

    getRole(){
        let token = sessionStorage.getItem('token');
        if(token!=null){
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(token);

        return decodedToken.type.toString();
        }else{
            return null;
        }
    }

    getHash(){
        let token = sessionStorage.getItem('token');
        if(token!=null){
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(token);

        return decodedToken.hash;
        }else{
            return null;
        }
    }
}