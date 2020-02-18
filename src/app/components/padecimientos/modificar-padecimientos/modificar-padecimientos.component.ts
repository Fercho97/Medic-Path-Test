import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { PadecimientoService } from '../padecimientos.service';
import { SintomasService } from '../../sintomas/sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import { AilmentNameValidator } from '../../../validators/AilmentNameValidator';
@Component({
  selector: 'app-modificar-padecimientos',
  templateUrl: './modificar-padecimientos.component.html',
  styleUrls: ['./modificar-padecimientos.component.css'],
  providers: [SintomasService, PadecimientoService]
})
export class ModificarPadecimientosComponent implements OnInit {

  modify: FormGroup;
  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  categorias = [
    {
      nombre: 'Estomacal'
    },
    {
      nombre: 'Respiratoria'
    },
    {
      nombre: 'Infecciosa'
    }
  ];

  public sintomas : any = [];
  public selectedSints : any = [];
  public padecimiento : Padecimiento = {} as any;
  public especializaciones : any = [];
  selectedFile : File = null;
  formData: any = new FormData();
  public  hasInfo : boolean = false;
  public urlImage : string = "../../../../assets/default-image.jpg";
  public originalValue : any = "";

  private nameValidators = [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(50)
  ]
  constructor(private padServ : PadecimientoService, private sintServ : SintomasService,
              private toast : ToastrService, private router : Router, 
              private url : ActivatedRoute, private nameVal : AilmentNameValidator) {
    this.modify = new FormGroup({
      nombre: new FormControl('', this.nameValidators),
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

  this.padServ.getPad(this.url.snapshot.params.hash).subscribe( (res : any) =>{
    console.log(res.body);
    this.padecimiento = res.body.padecimiento;
    this.originalValue = this.padecimiento.nombre_pad;
    this.selectedSints = res.body.sintomas;
    
    this.selectedSints.forEach(element => {
      let item = this.sintomas.find(s => s.idSint == element.idSint );

      this.sintomas = this.sintomas.filter(function(value,index, arr){
        return value != item;
      });
    });

    this.modify.controls['nombre'].setValue(this.padecimiento.nombre_pad, {onlySelf : true});
    this.modify.controls['categoria'].setValue(this.padecimiento.categoria, {onlySelf : true});
    this.modify.controls['descripcion'].setValue(this.padecimiento.descripcion, {onlySelf : true});
    this.modify.controls['especializacion'].setValue(this.padecimiento.espe_id, {onlySelf : true});
    if(this.padecimiento.url_imagen_pad!=null){
      this.hasInfo = true;
      this.urlImage = this.padecimiento.url_imagen_pad.toString();
    }

  });
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
  seleccionSintomas(){
    var id = this.modify.value.sintomas;

    console.log(id);

    let item = this.sintomas.find(s => s.idSint == id );

    console.log(item);

    this.selectedSints.push(item);

    this.sintomas = this.sintomas.filter(function(value,index, arr){
      return value != item;
    });
  }

  isAlreadySelected(elemento : any){
    
    this.selectedSints.forEach(element => {
      if(elemento == element.idSint){
        return true;
      }
    });
    return false;
  }

  quitarSintomas(){
    var id = this.modify.value.sintomasSeleccionados;

    console.log(id);

    let item = this.selectedSints.find(s => s.idSint == id );

    console.log(item);

    this.selectedSints = this.selectedSints.filter(function(value,index, arr){
      return value != item;
    });

    this.sintomas.push(item);
    console.log(this.selectedSints);

  }

  guardar(){
    var idsOnly : any = [];
     
    this.selectedSints.forEach(element => {
      idsOnly.push(element.idSint);
    });

      this.formData.append('nombre_pad',this.modify.value.nombre);
      this.formData.append('categoria', this.modify.value.categoria);
      this.formData.append('descripcion', this.modify.value.descripcion);
      this.formData.append('sintomas', idsOnly);
      this.formData.append('especializacion', this.modify.value.especializacion);
  
    
    this.padServ.updatePadecimiento(this.formData, this.url.snapshot.params.hash).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Se ha modificado el padecimiento con éxito!', 'Modificación Exitosa!');
    this.router.navigate(['/padecimientos'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error.message, 'Error');
      this.formData = new FormData();
  })
  }

  check(){
    console.log(this.modify.value.nombre.toString().toLowerCase());
    if(this.originalValue.toLowerCase()!=this.modify.value.nombre.toString().toLowerCase()){
      this.modify.get('nombre').updateValueAndValidity();
      this.modify.get('nombre').setAsyncValidators(this.nameVal.existingAilment());
      
    }else{
      this.modify.get('nombre').clearAsyncValidators();
      this.modify.get('nombre').updateValueAndValidity();
    }
  }
}
