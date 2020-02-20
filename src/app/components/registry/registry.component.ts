import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RegistryService } from './registry.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMsg } from '../../interfaces/errorMsg.const';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NicknameValidator } from "../../validators/NicknameValidator";
import { EmailValidator } from "../../validators/EmailValidator";
@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
  providers: [RegistryService, HttpClient]
})

export class RegistryComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;

  forma: FormGroup;
  
  private values : HttpParams;
  sexos = ['Hombre', 'Mujer', 'Indefinido'];
  public selectedEspe : any = [];
  public especializaciones : any = [];
  
  constructor(private regServ : RegistryService, private http : HttpClient, 
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
      fechanacimiento: new FormControl('', Validators.required),
      telefono: new FormControl('', [Validators.required,Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]')]),
      direccion: new FormControl('', Validators.required)
    });


  }


  ngOnInit() {
    this.regServ.getEspecializaciones().subscribe((res: any) =>{
      this.especializaciones = res.body;
    }, error =>{
      console.log(error);
    })
   }

  guardarCambios() {
    if(this.selectedEspe.length>0){
    var idsOnly : any = [];
    
   this.selectedEspe.forEach(element => {
     idsOnly.push(element.id);
   });
    let formData: any = new FormData();
    formData.append('nickname', this.forma.value.username)
    formData.append('email', this.forma.value.correo)
    formData.append('sexo', this.forma.value.genero)
    formData.append('nombres', this.forma.value.nombrecompleto.nombre)
    formData.append('apellidos', this.forma.value.nombrecompleto.apellido)
    formData.append('password', this.forma.value.password_validations.password1)
    formData.append('passwordVerif', this.forma.value.password_validations.password2)
    formData.append('tipoUsuario', '2')
    formData.append('fecha_nacimiento', this.forma.value.fechanacimiento);
    formData.append('telefono', this.forma.value.telefono);
    formData.append('direccion', this.forma.value.direccion);
    formData.append('especialidades', idsOnly);
    this.regServ.checkRegister(formData).subscribe((res:any) =>{
      sessionStorage.setItem('token',res.body.token);
      this.toast.success('Le hemos enviado un correo al usuario registrado confirmar su cuenta', 'Registro Exitoso!');
    this.router.navigate(['/home'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
  })
}else{
  this.toast.error("elija al menos una especialización", 'Error');
}

  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
    }else{
      moveItemInArray(this.especializaciones, event.previousIndex, event.currentIndex);
      
    }
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
