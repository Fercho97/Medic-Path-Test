import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Sintoma } from '../../../interfaces/sintoma.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import { SymptomNameValidator } from '../../../validators/SymptomNameValidator';
@Component({
  selector: 'app-modificar-sintomas',
  templateUrl: './modificar-sintomas.component.html',
  styleUrls: ['./modificar-sintomas.component.css'],
  providers : [SintomasService]
})
export class ModificarSintomasComponent implements OnInit {
  
  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  modify: FormGroup;
  moved = false;
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

  nivelesUrgencia = [
    {
      nombre: 'Ninguno',
      valor: '0'
    },
    {
      nombre: 'Bajo',
      valor: '0.2'
    },
    {
      nombre: 'Medio',
      valor: '0.4'
    },
    {
      nombre: 'Alto',
      valor: '0.6'
    },
    {
      nombre: 'Severo',
      valor: '0.8'
    }
  ];

  public compuestos : any = [];
  public selectedCompuestos : any = [];
  public sintoma : Sintoma = {} as any;
  public  isChecked : boolean;
  public composicionFront : string = "";
  public composicionBack : string = "";
  public originalValue : any = "";
  constructor(private sintServ : SintomasService, private router : Router,
              private toast : ToastrService, private url : ActivatedRoute,
              private nameVal : SymptomNameValidator) {
    this.modify = new FormGroup({
      nombre: new FormControl('', 
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]),

      keyword: new FormControl('', 
      [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)]),

      categoria: new FormControl('', Validators.required),
      urgencia: new FormControl('', Validators.required),
      descripcion: new FormControl('', 
      [Validators.required,
        Validators.minLength(20),
        Validators.maxLength(200)]),
      compuesto: new FormControl(''),
      componentes: new FormControl(''),
      composite: new FormControl('')
    });
  }

  ngOnInit() {
    //console.log(encodeURIComponent(this.url.snapshot.params.hash));

    //Carga de datos principales
    this.sintServ.getSint(this.url.snapshot.params.hash).subscribe( (res : any) =>{
      console.log(res);
      this.sintoma = res.body.sintoma;

      if(this.sintoma.compuesto==true){
        this.selectedCompuestos = res.body.compuestos;

        this.selectedCompuestos.forEach(element => {
          let item = this.compuestos.find(s => s.idSint == element.idSint );
    
          this.compuestos = this.compuestos.filter(function(value,index, arr){
            return value != item;
          });

          console.log(this.compuestos);
        });
        this.composicionFront = this.sintoma.composicion.replace(/,/g,'_');
      }

      
      console.log(this.selectedCompuestos);
     
      this.modify.patchValue({
        nombre : this.sintoma.nombre_sint,
        keyword : this.sintoma.keyWord,
        composite : this.composicionFront,
        descripcion : this.sintoma.descripcion,
        compuesto : this.sintoma.compuesto,
        categoria: this.sintoma.categoria_sint,
        urgencia: this.sintoma.nivel_urgencia
      })
      this.isChecked = this.sintoma.compuesto;
      this.modify.controls['categoria'].setValue(this.sintoma.categoria_sint, {onlySelf : true});
      this.modify.controls['urgencia'].setValue(this.sintoma.nivel_urgencia, {onlySelf : true});
      this.originalValue = this.sintoma.nombre_sint;
    });

    //Carga de componentes
    this.sintServ.getComponents().subscribe(res =>{
      this.compuestos = res.body;
    })
  }

  changed(evt){
    this.isChecked = evt.target.checked;
    console.log(evt.target.checked);
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      this.moved = true;
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
                        console.log(this.selectedCompuestos);
    }else{
      this.moved = true;
      moveItemInArray(this.compuestos, event.previousIndex, event.currentIndex);
      console.log(this.selectedCompuestos);
    }
  }

  modificar(){
    if(this.isChecked==false){
      this.values = new HttpParams()
      .set('nombre_sint', this.modify.value.nombre)
      .set('categoria_sint', this.modify.value.categoria)
      .set('descripcion', this.modify.value.descripcion)
      .set('keyWord', this.modify.value.keyword)
      .set('compuesto', 'false')
      .set('composicion', '')
      .set('nivel_urgencia', this.modify.value.urgencia)
    }else{
      this.nameToId();
      this.values = new HttpParams()
      .set('nombre_sint', this.modify.value.nombre)
      .set('categoria_sint', this.modify.value.categoria)
      .set('descripcion', this.modify.value.descripcion)
      .set('keyWord', this.modify.value.keyword)
      .set('compuesto', 'true')
      .set('composicion', this.composicionBack)
      .set('nivel_urgencia', this.modify.value.urgencia)
    }
    console.log(this.values);
    console.log(this.selectedCompuestos.length);
    if((this.isChecked==true && this.selectedCompuestos.length<=1) || this.selectedCompuestos.length===undefined){
      this.toast.error('Un sintoma compuesto debe tener al menos otros 2 sintomas como parte de su composición', 'Error');
    }else{
        this.sintServ.modificar(this.sintoma.hashId,this.values).subscribe((res:any) =>{
          console.log("Ok", res)
          sessionStorage.setItem('token',res.body.token);
          this.toast.success('Se ha modificado el sintoma con éxito!', 'Modificación Exitosa!');
        this.router.navigate(['/sintomas'])
      }, error =>{
          console.log("Error", error.error);
          this.toast.error(error.error.message, 'Error');
      })
    }
  }

  creacionComposicion(){
    var id = this.modify.value.componentes;

    console.log(id);

    let item = this.compuestos.find(s => s.idSint == id );

    if(this.composicionFront==""){
    this.composicionFront += item.nombre_sint;
    }else{
    this.composicionFront += "_&_" + item.nombre_sint;
    }

    this.modify.patchValue({
      composite: this.composicionFront
    })
  }

  cambioContextual(){
    console.log(this.modify.value.composite)
    this.composicionFront = this.modify.value.composite;
    console.log(this.composicionBack);
    console.log(this.compuestos);
  }

  nameToId(){
    this.composicionBack = "";
    for(let sintoma of this.selectedCompuestos){
      
            if(sintoma != null){
              if(this.composicionBack==""){
                this.composicionBack += sintoma.idSint;
                }else{
                this.composicionBack += ",&," + sintoma.idSint;
                }
            }
          }
  console.log(this.composicionBack);
  }

  isTheSame(compuesto : any){
    if(compuesto == this.sintoma.nombre_sint){
      return true;
    }
    else{
      return false;
    }
  }

  check(){
    if(this.originalValue.toLowerCase()!=this.modify.value.nombre.toString().toLowerCase()){
      this.modify.get('nombre').updateValueAndValidity();
      this.modify.get('nombre').setAsyncValidators(this.nameVal.existingSymptomName());
      
    }else{
      this.modify.get('nombre').clearAsyncValidators();
      this.modify.get('nombre').updateValueAndValidity();
    }
  }
}
