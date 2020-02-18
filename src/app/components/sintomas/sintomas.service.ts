import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SintomasService {
  _url: string = "";
  _urlIndividual: string = "";
  _urlComponente: string = "";
  _urlCreate: string = "";
  _urlCompList: string = "";
  _urlModificar: string = "";
  _urlCheckName: string = "";
  constructor(private _http: HttpClient) {
    this._url = "https://medicpath.herokuapp.com/sintomas/sintlist";
    //'http://localhost:3000/sintomas/sintlist/';
    this._urlIndividual = "https://medicpath.herokuapp.com/sintomas/";
    //'http://localhost:3000/sintomas/';
    this._urlComponente = "https://medicpath.herokuapp.com/sintomas/componentes";
    //'http://localhost:3000/sintomas/componentes';
    this._urlCreate = "https://medicpath.herokuapp.com/sintomas/create";
    //'http://localhost:3000/sintomas/create';
    this._urlCompList = "https://medicpath.herokuapp.com/sintomas/comp/getComponents/";
    //'http://localhost:3000/sintomas/comp/getComponents/';
    this._urlModificar = "https://medicpath.herokuapp.com/sintomas/update/";
    //'http://localhost:3000/sintomas/update/'
    this._urlCheckName = "https://medicpath.herokuapp.com/sintomas/checkName/";
    //"http://localhost:3000/sintomas/checkName/";
  }

  getSints() {
    return this._http.get(this._url, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getSint(hashId: any) {
    return this._http.get(this._urlIndividual + encodeURIComponent(hashId), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getNames(ids: HttpParams) {
    console.log(ids);
    return this._http.post(this._urlComponente, ids.toString(), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  createSintoma(values: HttpParams) {
    return this._http.post(this._urlCreate, values.toString(), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getComponents() {
    return this._http.get(this._urlCompList, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  modificar(hash: any, parametros: HttpParams) {
    return this._http.put(this._urlModificar + encodeURIComponent(hash), parametros.toString(), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  checkSintName(name : any){
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