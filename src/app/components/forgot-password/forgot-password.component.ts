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
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailValidator } from "../../validators/EmailValidator";
import { ErrorMsg } from '../../interfaces/errorMsg.const';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  values : HttpParams;
  recovery : FormGroup;
  constructor(private recServ : RecoveryService, private http : HttpClient, 
              private toastr : ToastrService, private router : Router, 
              private spinner : NgxSpinnerService, private emailVal : EmailValidator) { 

    this.recovery = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ], [this.emailVal.nonExistingEmail()])
    });
  }

  ngOnInit() {
  }

  sendReset(){
    this.values = new HttpParams()
    .set('email', this.recovery.value.email);
    this.spinner.show();
    this.recServ.resetRequest(this.values).subscribe((res :any) =>{
      this.toastr.info("Si la dirección de correo esta registrada en el sistema recibirá un email", "Entrega");
      this.spinner.hide();
      this.router.navigate(['/home']);
    }, error =>{
      //console.log(error);
      this.spinner.hide();
      this.router.navigate(['/home']);
    })
    
  }
}
