import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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
  _urlForDiagnostic: string = "";
  constructor(private _http: HttpClient) {
    this._url = environment.url + 'sintomas/sintlist/';
    this._urlIndividual = environment.url + 'sintomas/';
    this._urlComponente = environment.url + 'sintomas/componentes';
    this._urlCreate = environment.url + 'sintomas/create';
    this._urlCompList = environment.url + 'sintomas/comp/getComponents/';
    this._urlModificar = environment.url + 'sintomas/update/';
    this._urlCheckName = environment.url + 'sintomas/checkName/';
    this._urlForDiagnostic = environment.url + 'sintomas/sintsForDiagnostic';
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

  getSintsForDiagnostic() {
    return this._http.get(this._urlForDiagnostic, {
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