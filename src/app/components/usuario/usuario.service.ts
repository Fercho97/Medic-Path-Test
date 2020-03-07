import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
@Injectable()
export class UsuarioService {
  _url: string = "";
  _urlIndividual: string = "";
  _urlDoctor: string = "";
  _urlAllDocs: string = "";
  constructor(private _http: HttpClient) {
    this._url = environment.url + 'usuarios/userlist/';
    //"https://medicpath.herokuapp.com/usuarios/userlist/";
    //'http://localhost:3000/usuarios/userlist/';
    this._urlIndividual = environment.url + 'usuarios/';
    //"https://medicpath.herokuapp.com/usuarios/";
    //'http://localhost:3000/usuarios/'
    this._urlDoctor = environment.url + 'usuarios/doctor/';
    //"https://medicpath.herokuapp.com/usuarios/doctor/";
    //"http://localhost:3000/usuarios/doctor/";
    this._urlAllDocs = environment.url + 'usuarios/doctorlist/';
    //"https://medicpath.herokuapp.com/usuarios/doctorlist/";
    //"http://localhost:3000/usuarios/doctorlist/";

  }

  getUsers() {
    return this._http.get(this._url, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getUser(hash: any) {
    return this._http.get(this._urlIndividual + encodeURIComponent(hash), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getDoctorInfo(hash: any){
    return this._http.get(this._urlDoctor + encodeURIComponent(hash), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getDoctors(tipo : any){
    return this._http.get(this._urlAllDocs + tipo, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }
}