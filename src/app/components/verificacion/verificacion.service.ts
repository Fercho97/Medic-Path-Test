import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class VerificacionService {
  _url: string = "";
  constructor(private _http: HttpClient) {
    this._url = "https://medicpath.herokuapp.com/usuarios/verificar/";
    //'http://localhost:3000/usuarios/verificar/';
  }

  verifyUser(hashId: any) {
    return this._http.put(this._url + encodeURIComponent(hashId), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }
}