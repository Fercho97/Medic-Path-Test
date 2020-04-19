import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  _urlFeedbackUser : string = "";
  _urlNewestInfo : string = "";
  constructor(private _http: HttpClient) {
    this._urlFeedbackUser = environment.url + 'usuarios/notifications/user/';
    this._urlNewestInfo = environment.url + 'sintomas/news/lastCreations';
  }

  getWithoutFeedback(hash: any) {
    return this._http.get(this._urlFeedbackUser + encodeURIComponent(hash), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }
}