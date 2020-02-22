import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PadecimientoService } from '../padecimientos.service';
import { SintomasService } from '../../sintomas/sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import{ AilmentNameValidator } from '../../../validators/AilmentNameValidator';
@Component({
  selector: 'app-agregar-padecimientos',
  templateUrl: './agregar-padecimientos.component.html',
  styleUrls: ['./agregar-padecimientos.component.css'],
  providers: [SintomasService, PadecimientoService]
})
export class AgregarPadecimientosComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  padecimiento: FormGroup;
  private values : HttpParams;

  categorias = [
    {
      nombre: 'Estomacal'
    },
    {
      nombre: 'Respiratoria'
    },
    {
      nombre: 'Infecciosa'
    },
    {
      nombre:'Alergica'
    },
    {
      nombre: 'Ocular'
    },
    {
      nombre: 'Corporal'
    }
  ];

  public sintomas : any = [];
  public selectedSints : any = [];
  public especializaciones : any = [];
  selectedFile : File = null;
  formData: any = new FormData();
  
  constructor(private padServ : PadecimientoService, private sintServ : SintomasService,
              private toast : ToastrService, private router : Router, private nameVal : AilmentNameValidator) {
    this.padecimiento = new FormGroup({
      nombre: new FormControl('', 
      [Validators.required,
       Validators.minLength(4),
       Validators.maxLength(50)], [this.nameVal.existingAilment()]),

      categoria: new FormControl('', Validators.required),
      especializacion: new FormControl('', Validators.required),
      descripcion: new FormControl('', [Validators.required,
      Validators.minLength(20),
      Validators.maxLength(200)]),

      sintomas: new FormControl(''),
      imagen : new FormControl(''),
      sintomasSeleccionados : new FormControl('')
    });
  }

  ngOnInit() {
    this.padServ.getEspecializaciones().subscribe((res: any) =>{
      this.especializaciones = res.body;
    }, error =>{
      console.log(error);
    })

    this.sintServ.getSints().subscribe( (res: any) =>{
      this.sintomas = res.body;
    },
  error =>{
      console.log(error);
  })
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formData.append('image', this.selectedFile, this.selectedFile.name);
    console.log(this.formData.get('image'));
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
                        console.log(this.selectedSints);
    }else{
      moveItemInArray(this.sintomas, event.previousIndex, event.currentIndex);
      console.log(this.selectedSints);
    }
  }

  guardar(){
    var idsOnly : any = [];
     
    this.selectedSints.forEach(element => {
      idsOnly.push(element.idSint);
    });

      this.formData.append('nombre_pad',this.padecimiento.value.nombre);
      this.formData.append('categoria', this.padecimiento.value.categoria);
      this.formData.append('descripcion', this.padecimiento.value.descripcion);
      this.formData.append('sintomas', idsOnly);
      this.formData.append('especializacion', this.padecimiento.value.especializacion);
    console.log(JSON.stringify(this.formData));
    
    this.padServ.createPadecimiento(this.formData).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Se ha registrado el padecimiento con éxito!', 'Registro Exitoso!');
    this.router.navigate(['/padecimientos'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
      this.formData = new FormData();
  })
  }
}
