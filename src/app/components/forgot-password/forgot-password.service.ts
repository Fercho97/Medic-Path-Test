import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class RecoveryService{
    _url : string = '';
    private router: Router;
    constructor(private _http: HttpClient) {

        this._url = environment.url + 'usuarios/resetPassword';
       //'https://medicpath.herokuapp.com/usuarios/resetPassword';
       //'http://localhost:3000/usuarios/resetPassword';
    }

    resetRequest(valores : HttpParams){
        return this._http.post(this._url,
            valores.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }
}