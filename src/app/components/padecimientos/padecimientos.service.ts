import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PadecimientoService {
  _url: string = "";
  _urlInd: string = "";
  _create: string = "";
  _urlModificar = "";
  _urlEspecializaciones = "";
  
  constructor(private _http: HttpClient) {
    this._url = environment.url + 'padecimientos/padlist';

    this._urlInd = environment.url + 'padecimientos/';

    this._create = environment.url + 'padecimientos/create';

    this._urlModificar = environment.url + 'padecimientos/update/';

    this._urlEspecializaciones = environment.url + 'especializacion/esplist';
  }

  getPads() {
    return this._http.get(this._url, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getPad(hashId: any) {
    return this._http.get(this._urlInd + encodeURIComponent(hashId), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  createPadecimiento(values: FormData) {
    return this._http.post(this._create, values, {
      observe: "response"
    });
  }

  updatePadecimiento(values: FormData, hashId: any) {
    return this._http.put(
      this._urlModificar + encodeURIComponent(hashId),
      values,
      {
        observe: "response"
      }
    );
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