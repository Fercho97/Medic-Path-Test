import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class TokenService{

    constructor(){

    }

    getRole(){
        let token = sessionStorage.getItem('token');
        if(token!=null){

        const decodedToken = jwt_decode(token);
        return decodedToken.type.toString();
        }else{
            return null;
        }
    }

    getHash(){
        let token = sessionStorage.getItem('token');
        if(token!=null){

        const decodedToken = jwt_decode(token);

        return decodedToken.hash;
        }else{
            return null;
        }
    }
}