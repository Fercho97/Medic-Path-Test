import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RecoveryService } from './forgot-password.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  values : HttpParams;
  recovery : FormGroup;
  constructor(private recServ : RecoveryService, private http : HttpClient, private toastr : ToastrService, private router : Router) { 

    this.recovery = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),
      ])
    });
  }

  ngOnInit() {
  }

  sendReset(){
    this.values = new HttpParams()
    .set('email', this.recovery.value.email);

    this.recServ.resetRequest(this.values).subscribe((res :any) =>{
      this.toastr.info("Se ha enviado un correo a la dirección que indico, llegara en un momento", "Enviado");
      this.router.navigate(['/home']);
    }, error =>{
      //console.log(error);
      this.router.navigate(['/home']);
    })
    
  }
}
