import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private router:Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const token : string = sessionStorage.getItem('token');

        let request = req;

        if(token){
            request = req.clone({
                setHeaders:{
                    authorization: token
                }
            });
        }

        return <any>next.handle(request).pipe(
            catchError((err: HttpErrorResponse) =>{

                if(err.status === 401){
                    sessionStorage.clear();
                    window.localStorage.setItem('action','inactividad');
                    this.router.navigate(['/home']);
                }else if(err.status === 403){
                    window.localStorage.setItem('action','restricted');
                    this.router.navigate(['/home']);
                }

                return throwError( err );
            })
        );
    }
}