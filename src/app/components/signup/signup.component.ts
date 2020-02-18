import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SignupService } from './signup.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMsg } from '../../interfaces/errorMsg.const';
import { map } from 'rxjs/operators';
import { NicknameValidator } from "../../validators/NicknameValidator";
import { EmailValidator } from "../../validators/EmailValidator";
import { DateValidator } from '../../validators/DateValidator';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService, HttpClient]
})

export class SignupComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;

  forma: FormGroup;
  
  private values : HttpParams;
  sexos = ['Hombre', 'Mujer', 'Indefinido'];


  constructor(private signupServ : SignupService, private http : HttpClient, 
    private router : Router, private toast : ToastrService, private nickVal : NicknameValidator,
    private emailVal : EmailValidator) {
    this.forma = new FormGroup({

      nombrecompleto: new FormGroup({
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ])
      }),
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ], [this.emailVal.existingEmail()]),
      genero: new FormControl('Indefinido', Validators.required),
      username: new FormControl('', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)],[this.nickVal.existingNickname()]),
        password_validations : new FormGroup({
          password1 : new FormControl('', [Validators.required, Validators.minLength(5)]),
          password2 : new FormControl('', Validators.required),
          }, (formGroup : FormGroup) => {
              return this.equalPasswords(formGroup);
          }),
      fechanacimiento: new FormControl('', [Validators.required,DateValidator.isFutureDate,DateValidator.noValidAge]),
    });


  }


  ngOnInit() { }

  guardarCambios() {
    console.log(this.forma.value);
    console.log(this.forma);
    this.values = new HttpParams()
    .set('nickname', this.forma.value.username)
    .set('email', this.forma.value.correo)
    .set('sexo', this.forma.value.genero)
    .set('nombres', this.forma.value.nombrecompleto.nombre)
    .set('apellidos', this.forma.value.nombrecompleto.apellido)
    .set('password', this.forma.value.password_validations.password1)
    .set('passwordVerif', this.forma.value.password_validations.password2)
    .set('tipoUsuario', '1')
    .set('fecha_nacimiento', this.forma.value.fechanacimiento);
    this.signupServ.checkRegister(this.values).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Le hemos enviado un correo para confirmar su cuenta', 'Registro Exitoso!');
    this.router.navigate(['/home'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
  })
  }

  noIgual(control: FormControl): { [s: string]: boolean } {
    const forma: any = this;
    if (control.value !== forma.controls.password1.value) {
      return {
        noiguales: true
      };
    }
    return null;
  }

  equalPasswords(formGroup : FormGroup){
    let val;
    let valid = true;

    for(let key in formGroup.controls){
      if(formGroup.controls.hasOwnProperty(key)){
        let control : FormControl = <FormControl>formGroup.controls[key];
        if(val === undefined){
           val = control.value
        }else{
          if(val !== control.value){
             valid = false;
             break;
          }
        }
      }
    }
    if(valid){
      return null;
    }
    return{
      equalPasswords : true
    }
  }
}
