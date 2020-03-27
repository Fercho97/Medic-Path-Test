import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import { SymptomNameValidator } from '../../../validators/SymptomNameValidator';
import { Catalogos } from '../../../interfaces/catalogos.const';
import { RegistryService } from '../../registry/registry.service'
@Component({
  selector: 'app-agregar-sintomas',
  templateUrl: './agregar-sintomas.component.html',
  styleUrls: ['./agregar-sintomas.component.css'],
  providers : [SintomasService, HttpClient, RegistryService]
})
export class AgregarSintomasComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  zone_options = ErrorMsg.Zone_options.options;
  
  sintomas: FormGroup;
  public  isChecked : boolean = false;
  private values : HttpParams;
  categorias = Catalogos.CATEGORIAS;

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
  public composicionFront : string = "";
  public composicionBack : string = "";
  public especializaciones : any = [];
  public especializacionesSeleccionadas : any = [];
  public isEmpty = false;
  public isNot100 = false;
  constructor(private sintServ : SintomasService, private router : Router, 
              private toast : ToastrService, private nameVal : SymptomNameValidator,
              private regServ : RegistryService) {
    this.sintomas = new FormGroup({
      nombre: new FormControl('', 
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)], [this.nameVal.existingSymptomName()]),

      keyword: new FormControl('', 
      [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)]),

      categoria: new FormControl('', Validators.required),

      urgencia: new FormControl('', Validators.required),
      body_zone: new FormControl('', Validators.required),
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
      this.sintServ.getComponents().subscribe(res =>{
        this.compuestos = res.body;
        console.log(this.compuestos);
      })

      this.regServ.getEspecializaciones().subscribe(res =>{
        this.especializaciones = res.body;
      })
  }

  guardar() {
    console.log(this.isChecked);
    if(this.isChecked==false){
      this.values = new HttpParams()
      .set('nombre_sint', this.sintomas.value.nombre)
      .set('categoria_sint', this.sintomas.value.categoria)
      .set('descripcion', this.sintomas.value.descripcion)
      .set('keyWord', this.sintomas.value.keyword)
      .set('compuesto', 'false')
      .set('composicion', '')
      .set('nivel_urgencia', this.sintomas.value.urgencia)
      .set('body_zone', this.sintomas.value.body_zone)
      .set('porcentages', JSON.stringify(this.especializacionesSeleccionadas));
    }else{
      this.nameToId();
      this.values = new HttpParams()
      .set('nombre_sint', this.sintomas.value.nombre)
      .set('categoria_sint', this.sintomas.value.categoria)
      .set('descripcion', this.sintomas.value.descripcion)
      .set('keyWord', this.sintomas.value.keyword)
      .set('compuesto', 'true')
      .set('composicion', this.composicionBack)
      .set('nivel_urgencia', this.sintomas.value.urgencia)
      .set('body_zone', this.sintomas.value.body_zone)
      .set('porcentages', JSON.stringify(this.especializacionesSeleccionadas));
    }

    if((this.isChecked==true && this.selectedCompuestos.length<=1) || this.selectedCompuestos.length===undefined){
      this.toast.error('Un sintoma compuesto debe tener al menos otros 2 sintomas como parte de su composición', 'Error');
    }else{
        this.sintServ.createSintoma(this.values).subscribe((res:any) =>{
        
          sessionStorage.setItem('token',res.body.token);
          this.toast.success('Se ha registrado el sintoma con éxito!', 'Registro Exitoso!');
        this.router.navigate(['/sintomas'])
      }, error =>{
          this.toast.error(error.error.message, 'Error');
      })
    }
  }

  changed(evt){
    this.isChecked = evt.target.checked;
    console.log(evt.target.checked);
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
    }else{
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
    }
  }

  creacionComposicion(){
    var id = this.sintomas.value.componentes;

    let item = this.compuestos.find(s => s.idSint == id );

    if(this.composicionFront==""){
    this.composicionFront += item.nombre_sint;
    }else{
    this.composicionFront += "_&_" + item.nombre_sint;
    }

    this.sintomas.patchValue({
      composite: this.composicionFront
    })
  }

  cambioContextual(){
    this.composicionFront = this.sintomas.value.composite;
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
    //console.log(this.composicionBack);
  }

  setPorcentage(espe : any,value : any){
    espe.porcentaje  = Number(value);
    console.log("entered")
    if(value===""){
      this.isEmpty=true;
    }else{
      this.isEmpty=false;
    }
    let sum : number = 0;
    for(var selected of this.especializacionesSeleccionadas){
      sum = sum + Number(selected.porcentaje);
    }
    if(sum>100 || sum<100){
      this.isNot100=true;
    }else{
      this.isNot100=false;
    }
  }

  validateKey(event){
    var key = window.event ? event.keyCode : event.which;
    if(event.keyCode == 38 || event.keyCode == 40){
      return true;
    }else{
      return false;
    }
  }
}
