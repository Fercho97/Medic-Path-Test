import { 
  Component, 
  OnInit,
  ViewChild,
  ElementRef
 } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ResetPassService } from './reset-password.service';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMsg } from '../../interfaces/errorMsg.const';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  reset: FormGroup;
  private values : HttpParams;
  private hash : string = '';
  isValid : boolean = false;
  fromProfile: boolean = false;
  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  constructor(private restServ : ResetPassService, private http : HttpClient, private router : Router, private toast : ToastrService, private url : ActivatedRoute) { 
   
    this.reset = new FormGroup({
            
                    password_validations : new FormGroup({
                      newPass : new FormControl('', [Validators.required, Validators.minLength(5)]),
                      verifiedPassword : new FormControl('', Validators.required),
                      }, (formGroup : FormGroup) => {
                          return this.equalPasswords(formGroup);
                      })
                });
  }

  
  ngOnInit() {
    if(this.url.snapshot.params.hash){
    this.verifyUrl(this.url.snapshot.params.hash);
    }
    else if(sessionStorage.getItem('usuario')!=null){
      this.fromProfile=true;
      this.isValid=true;
    }else{
      this.router.navigate(['/home']);
    }
  }

  changePassword(){
    if(this.url.snapshot.params.hash){
        this.hash = this.url.snapshot.params.hash;

        this.values = new HttpParams()
        .set('newPassword', this.reset.value.password_validations.newPass);

        this.restServ.restorePassword(this.hash,this.values).subscribe( (res : any) =>{
        this.toast.success('Se ha modificado la contraseña con éxito ', 'Éxito!');
        this.router.navigate(['/home']);
      }, error =>{
          console.log("Error", error.error.message);
          this.toast.error(error.error.message, 'Error');
      })
    }else{
      this.hash = sessionStorage.getItem('hash');
      
        this.values = new HttpParams()
        .set('newPassword', this.reset.value.password_validations.newPass);

        this.restServ.changePassword(this.hash,this.values).subscribe( (res : any) =>{
        this.toast.success('Se ha modificado su contraseña con éxito es necesario que vuelva a iniciar sesión ', 'Éxito!');
        sessionStorage.clear();
        window.location.reload();
        this.router.navigate(['/home']);
      }, error =>{
          console.log("Error", error.error.message);
          this.toast.error(error.error.message, 'Error');
      })
    }
  }

  verifyUrl(hashID : any){
    this.hash = hashID;

    this.restServ.verificarUrl(this.hash).subscribe( (res : any) =>{
      this.isValid = true;
    }, error =>{
      setTimeout(() =>{
        this.router.navigate(['/home'])
      }, 5000);
    })

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
