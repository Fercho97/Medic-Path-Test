import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class DiagnosticService{
    _url : string = '';
    _saveUrl : string = '';
    _registeredUsers : string = '';
    constructor(private _http : HttpClient){
        
        this._url = environment.url + 'consulta/getReglas';
        //"https://medicpath.herokuapp.com/consulta/getReglas";
        //"http://localhost:3000/consulta/getReglas";
        this._saveUrl = environment.url + 'historial/create';
        //"https://medicpath.herokuapp.com/historial/create"
        //"http://localhost:3000/historial/create"
        this._registeredUsers = environment.url + 'usuarios/pacientslist';
        //"https://medicpath.herokuapp.com/usuarios/pacientslist"
        //"http://localhost:3000/usuarios/pacientslist";
        
    }

    consulta(mira : any){
        return this._http.get(this._url,
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }

    guardarHistorial(valores : HttpParams){
        return this._http.post(this._saveUrl,
            valores.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }

    obtenerUsuarios(){
      return this._http.get(this._registeredUsers,
      {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
      },
    )
    }
}