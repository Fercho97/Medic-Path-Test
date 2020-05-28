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
import { RegistryService } from '../../registry/registry.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-agregar-sintomas',
  templateUrl: './agregar-sintomas.component.html',
  styleUrls: ['./agregar-sintomas.component.css'],
  providers : [SintomasService, HttpClient, RegistryService]
})
export class AgregarSintomasComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  
  sintomas: FormGroup;
  public  isChecked : boolean = false;
  private values : HttpParams;
  categorias = Catalogos.CATEGORIAS;
  respuestas = [
    {
      tipo: 'Verdadero o falso'
    },
    {
      tipo: 'Numérica'
    }
  ]
  rangos = [
    {
      nombre: 'Mayor que'
    },
    {
      nombre: 'Menor que'
    }
  ]

  public nivelesUrgencia : any = [];
  public zone_options : any = [];
  public compuestos : any = [];
  public selectedCompuestos : any = [];
  public composicionFront : string = "";
  public composicionBack : string = "";
  public especializaciones : any = [];
  public especializacionesSeleccionadas : any = [];
  public isEmpty = false;
  public isNot100 = false;
  public sum : number = 0;
  public hasIndex = false;
  public expectsNumericAnswer = false;
  constructor(private sintServ : SintomasService, private router : Router, 
              private toast : ToastrService, private nameVal : SymptomNameValidator,
              private regServ : RegistryService, private spinner : NgxSpinnerService) {
    this.sintomas = new FormGroup({
      nombre: new FormControl('', 
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^([ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+ )*[ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+$')], [this.nameVal.existingSymptomName()]),

      keyword: new FormControl('', 
      [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern('^([ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+ )*[ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+$')]),

      categoria: new FormControl('', Validators.required),

      urgencia: new FormControl('', Validators.required),
      body_zone: new FormControl('', Validators.required),
      descripcion: new FormControl('',
      [Validators.required,
        Validators.minLength(20),
        Validators.maxLength(200),
        Validators.pattern('^([ñÑáÁéÉíÍóÓúÚüÜa-zA-Z,.]+ )*[ñÑáÁéÉíÍóÓúÚüÜa-zA-Z,.]+$')]),
      question: new FormControl('', [Validators.minLength(20), Validators.maxLength(120)]),
      index_question: new FormControl('', [Validators.minLength(20), Validators.maxLength(120)]),
      compuesto: new FormControl(''),
      componentes: new FormControl(''),
      composite: new FormControl(''),
      answerType: new FormControl('Verdadero o falso',Validators.required),
      valorNum: new FormControl(''),
      rango: new FormControl('')
    });
  }

  ngOnInit() {
      this.sintServ.getComponents().subscribe(res =>{
        this.compuestos = res.body;
        //console.log(this.compuestos);
      }, error =>{
        this.toast.error('Hubo un error al conseguir la información del catálogo de síntomas, favor de recargar la página', 'Error');
      })

      this.sintServ.getZones().subscribe((res:any) =>{
        this.zone_options = res.body.resultado;
        //console.log(this.compuestos);
      }, error =>{
        this.toast.error('Hubo un error al conseguir la información del catálogo de zonas, favor de recargar la página', 'Error');
      })

      this.sintServ.getNiveles().subscribe((res:any) =>{
        this.nivelesUrgencia = res.body.resultado;
        //console.log(this.compuestos);
      }, error =>{
        this.toast.error('Hubo un error al conseguir la información del catálogo de niveles de urgencia, favor de recargar la página', 'Error');
      })

      this.regServ.getEspecializaciones().subscribe(res =>{
        this.especializaciones = res.body;
      }, error=>{
        this.toast.error('Hubo un error al conseguir la información del catálogo de especializaciones, favor de recargar la página', 'Error');
      })
  }

  guardar() {
    //console.log(this.isChecked);
    let question = {};
    if(this.sintomas.value.answerType=='Numérica'){
       question = {type: 'numeric', message: this.sintomas.value.question, 
                  valorNum: this.sintomas.value.valorNum, range: this.sintomas.value.rango}
    }else{
      if(this.sintomas.value.question==='' || this.sintomas.value.question===null){
        question = { message: "¿Ha tenido " + this.sintomas.value.nombre + "?", type: "boolean"};
      }else{
        question = { message: this.sintomas.value.question, type: "boolean"}
      }
    }
    let index_question = '';
    if(this.sintomas.value.urgencia>=0.4 && (this.sintomas.value.index_question == '' || this.sintomas.value.index_question == null)){
      index_question = 'En un rango del 1 al 10 que tanta molestia le causa ' + this.sintomas.value.nombre;
    }else if(this.sintomas.value.urgencia>=0.4 && (this.sintomas.value.index_question != '' || this.sintomas.value.index_question != null)){
      index_question = this.sintomas.value.index_question;
    }else{
      index_question = '';
    }


    this.spinner.show();
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
      .set('porcentages', JSON.stringify(this.especializacionesSeleccionadas))
      .set('question', JSON.stringify(question))
      .set('index_question',index_question);
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
      .set('porcentages', JSON.stringify(this.especializacionesSeleccionadas))
      .set('question', JSON.stringify(question))
      .set('index_question',index_question);
    }

    if((this.isChecked==true && this.selectedCompuestos.length<=1) || this.selectedCompuestos.length===undefined){
      this.toast.error('Un sintoma compuesto debe tener al menos otros 2 sintomas como parte de su composición', 'Error');
      this.spinner.hide();
    }else if(this.especializacionesSeleccionadas.length===undefined || this.especializacionesSeleccionadas.length===0){
      this.toast.error('Debe indicar al menos una especialidad para el síntoma', 'Error');
      this.spinner.hide();
    }else{
        this.sintServ.createSintoma(this.values).subscribe((res:any) =>{
        
          sessionStorage.setItem('token',res.body.token);
          this.toast.success('Se ha registrado el sintoma con éxito!', 'Registro Exitoso!');
          this.spinner.hide();
        this.router.navigate(['/sintomas'])
      }, error =>{
          this.toast.error('Hubo un error al registrar el síntoma, intentelo de nuevo', 'Error');
          this.spinner.hide();
      })
    }
  }

  changed(evt){
    this.isChecked = evt.target.checked;
    //console.log(evt.target.checked);
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
    }else{
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
    }
    this.totalPorcentage();
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
    //console.log("entered")
    if(value===""){
      this.isEmpty=true;
    }else{
      this.isEmpty=false;
    }
    
    this.totalPorcentage()
  }

  totalPorcentage(){
    let sum : number = 0;
    for(var selected of this.especializacionesSeleccionadas){
      sum = sum + Number(selected.porcentaje);
    }
    if(sum>100 || sum<100 || Number.isNaN(sum)){
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

  indexed(){
    if(this.sintomas.value.urgencia >= 0.4){
      this.hasIndex=true;
    }else{
      this.hasIndex=false;
    }
  }

  changeType(){
    if(this.sintomas.value.answerType=="Numérica"){
      this.expectsNumericAnswer=true;
      this.sintomas.get('question').setValidators([Validators.minLength(20), Validators.maxLength(120), Validators.required]);
      this.sintomas.get('valorNum').setValidators([Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]);
      this.sintomas.get('rango').setValidators([Validators.required]);
      this.sintomas.get('question').updateValueAndValidity();
      this.sintomas.get('valorNum').updateValueAndValidity();
      this.sintomas.get('rango').updateValueAndValidity();
    }else{
      this.expectsNumericAnswer=false;
      this.sintomas.get('question').setValidators([Validators.minLength(20), Validators.maxLength(120)]);
      this.sintomas.get('valorNum').clearValidators();
      this.sintomas.get('rango').clearValidators();
      this.sintomas.get('question').updateValueAndValidity();
      this.sintomas.get('valorNum').updateValueAndValidity();
      this.sintomas.get('rango').updateValueAndValidity();
    }
  }
}
