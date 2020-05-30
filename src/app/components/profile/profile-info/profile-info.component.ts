import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { NicknameValidator } from "../../../validators/NicknameValidator";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  providers: [ProfileService]
})
export class ProfileInfoComponent implements OnInit {

  @Input() usuarioInfo: any;
  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  formData: any = new FormData();
  datos_perfil : FormGroup;
  public originalValue : any = "";
  constructor(private profileServ : ProfileService, private toast : ToastrService, 
              private router : Router, private nickVal : NicknameValidator,
              private spinner : NgxSpinnerService) {
    this.datos_perfil = new FormGroup({
      nickname : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z0-9 ]+ )*[a-zA-Z0-9]+$')
      ])
    })
   }

  ngOnInit() {
  }

  actualizarDatos(){
    //console.log(this.datos_perfil.value);
    this.formData.append('nickname', this.datos_perfil.value.nickname);
    this.spinner.show();
        this.profileServ.updateUser(this.usuarioInfo.hash_id, this.formData, sessionStorage.getItem('token')).subscribe( (res: any) =>{
          //console.log(res);
          if(res.body.mensaje != "Token no válido"){
            if(res.body.message=="No hubo cambios"){
              this.toast.info(res.body.message);
            }else{
                this.toast.success("Se actualizo su nombre de usuario con éxito", 'Modificación Exitosa!');
            }
          this.formData = new FormData();
          this.spinner.hide();
          sessionStorage.setItem('token', res.body.token);
          }else{
            this.spinner.hide();
            sessionStorage.clear();
            localStorage.setItem('action', 'inactividad');
            this.router.navigate(['/home']);
          }
        },
      error =>{
        //console.log(error.message);
          this.spinner.hide();
          this.toast.error(error.error.message,'Error');
          this.formData = new FormData();
      })
    
  }

  check(){
    if(this.usuarioInfo.nickname.toLowerCase()!=this.datos_perfil.get('nickname').value.toString().toLowerCase()){

      this.datos_perfil.get('nickname').updateValueAndValidity();
      this.datos_perfil.get('nickname').setAsyncValidators(this.nickVal.existingNickname());
      
    }else{
      this.datos_perfil.get('nickname').clearAsyncValidators();
      this.datos_perfil.get('nickname').updateValueAndValidity();
    }
  }
}
