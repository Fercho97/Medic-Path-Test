import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class SignupService{
    _url : string = '';
    _checkUserName : string = '';
    _checkEmail : string = '';
    _urlCheckName = "";
    private router: Router;
    constructor(private _http: HttpClient) {
        this._url = environment.url + 'usuarios/create';
        this._checkUserName = environment.url + 'usuarios/checkUsername/';
        this._checkEmail = environment.url + 'usuarios/checkEmail/';

        this._urlCheckName = environment.url + 'padecimientos/checkName/';
    }

    checkRegister(valores : HttpParams){
        //console.log(this._url);
        //console.log(valores.toString());
        return this._http.post(this._url,
            valores.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }

    checkNickname(nickname : any){
        return this._http.get(this._checkUserName + nickname,
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
        })
    }

    checkEmail(email : any){
        return this._http.get(this._checkEmail + email,
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
        })
    }

    checkPadName(name : any){
        return this._http.get(this._urlCheckName + name,
        {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
          observe: "response"
        })
      }
}