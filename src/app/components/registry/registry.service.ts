import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class RegistryService{
    _url : string = '';
    _urlEspecializaciones = "";
    private router: Router;
    constructor(private _http: HttpClient) {
        this._url = environment.url + 'usuarios/createDoctor';
        //'https://medicpath.herokuapp.com/usuarios/createDoctor';
        //'http://localhost:3000/usuarios/createDoctor';

        this._urlEspecializaciones = environment.url + 'especializacion/esplist';
        //"https://medicpath.herokuapp.com/especializacion/esplist";
        //'http://localhost:3000/especializacion/esplist';
    }

    checkRegister(valores : FormData){
        console.log(valores);
        return this._http.post(this._url, valores,
            {
              observe : 'response'
            },
          )
    }

    getEspecializaciones() {
        return this._http.get(this._urlEspecializaciones, {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
          observe: "response"
        });
      }
}