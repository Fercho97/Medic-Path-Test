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
        this._saveUrl = environment.url + 'historial/create';
        this._registeredUsers = environment.url + 'usuarios/pacientslist';
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

    showSymtoms(seleccion : any, totales: any){
      console.log(seleccion);
      let selectedNames : any  = [];
      for(let sintoma of seleccion){
        let found = totales.find(sint => sint['idSint']==sintoma);
        selectedNames.push({name: found.nombre_sint, descripcion: found.descripcion});
      }
      return selectedNames;
    }
}