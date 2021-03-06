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
import { RegistryService } from '../../registry/registry.service';
import { Catalogos } from '../../../interfaces/catalogos.const';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public sintoma : Sintoma = {} as any;
  public  isChecked : boolean;
  public composicionFront : string = "";
  public composicionBack : string = "";
  public originalValue : any = "";
  public especializaciones : any = [];
  public especializacionesSeleccionadas : any = [];
  public isEmpty = false;
  public isNot100 = false;
  public pregunta : any = {};
  public hasIndex = false;
  public expectsNumericAnswer = false;
  constructor(private sintServ : SintomasService, private router : Router,
              private toast : ToastrService, private url : ActivatedRoute,
              private nameVal : SymptomNameValidator, private regServ : RegistryService,
              private spinner : NgxSpinnerService) {
    this.modify = new FormGroup({
      nombre: new FormControl('', 
      [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),Validators.pattern('^([ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+ )*[ñÑáÁéÉíÍóÓúÚüÜa-zA-Z]+$')]),

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
      compuesto: new FormControl(''),
      componentes: new FormControl(''),
      question: new FormControl('', [Validators.minLength(20), Validators.maxLength(120)]),
      index_question: new FormControl('', [Validators.minLength(20), Validators.maxLength(120)]),
      composite: new FormControl(''),
      answerType: new FormControl('',Validators.required),
      valorNum: new FormControl(''),
      rango: new FormControl('')
    });
  }

  ngOnInit() {
    //console.log(encodeURIComponent(this.url.snapshot.params.hash));
    this.spinner.show();
    this.regServ.getEspecializaciones().subscribe(res =>{
      this.especializaciones = res.body;
    }, error =>{
      this.toast.error('Hubo un error al conseguir la información del catálogo de especializaciones, favor de recargar la página', 'Error');
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

    //Carga de datos principales
    this.sintServ.getSint(this.url.snapshot.params.hash).subscribe( (res : any) =>{
      let question = '';
      let type = 'Verdadero o falso';
      let valor = '';
      let valorRango = '';
      this.sintoma = res.body.sintoma;
      if(res.body.sintoma.porcentages!=null){
      this.especializacionesSeleccionadas = JSON.parse(res.body.sintoma.porcentages);
      }

      if(res.body.sintoma.question!=null){
        this.pregunta = JSON.parse(res.body.sintoma.question);

        question = this.pregunta.message;
        if(this.pregunta.type=='numeric'){
          this.expectsNumericAnswer=true;
          type="Numérica";
          valor=this.pregunta.valorNum;
          valorRango=this.pregunta.range;
          this.updateValidatorsForNumeric();
        }
      }

      if(this.sintoma.nivel_urgencia>=0.4){
        this.hasIndex=true;
      }

      if(this.sintoma.compuesto==true){
        this.selectedCompuestos = res.body.compuestos;

        this.selectedCompuestos.forEach(element => {
          let item = this.compuestos.find(s => s.idSint == element.idSint );
    
          this.compuestos = this.compuestos.filter(function(value,index, arr){
            return value != item;
          });

          //console.log(this.compuestos);
        });
        this.composicionFront = this.sintoma.composicion.replace(/,/g,'_');
      }

      
      //console.log(this.selectedCompuestos);

      this.modify.patchValue({
        nombre : this.sintoma.nombre_sint,
        keyword : this.sintoma.keyWord,
        composite : this.composicionFront,
        descripcion : this.sintoma.descripcion,
        compuesto : this.sintoma.compuesto,
        categoria: this.sintoma.categoria_sint,
        urgencia: this.sintoma.nivel_urgencia,
        body_zone: this.sintoma.body_zone,
        question: question,
        index_question: this.sintoma.index_question,
        answerType: type,
        valorNum: valor,
        rango: valorRango
      })
      this.isChecked = this.sintoma.compuesto;
      this.modify.controls['categoria'].setValue(this.sintoma.categoria_sint, {onlySelf : true});
      this.modify.controls['urgencia'].setValue(this.sintoma.nivel_urgencia, {onlySelf : true});
      this.modify.controls['body_zone'].setValue(this.sintoma.body_zone, {onlySelf : true});
      this.modify.controls['answerType'].setValue(type,{onlySelf: true});
      this.originalValue = this.sintoma.nombre_sint;
      this.spinner.hide();
    }, error =>{
      this.spinner.hide();
      this.toast.error('Error al conseguir la información del síntoma', 'Error');
    });

    //Carga de componentes
    this.sintServ.getComponents().subscribe(res =>{
      this.compuestos = res.body;
    })
    
  }

  changed(evt){
    this.isChecked = evt.target.checked;
    //console.log(evt.target.checked);
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      this.moved = true;
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
    }else{
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    this.totalPorcentage();
  }

  modificar(){
    let question = {};
    if(this.modify.value.answerType=='Numérica'){
      question = {type: 'numeric', message: this.modify.value.question, 
                  valorNum: this.modify.value.valorNum, range: this.modify.value.rango}
   }else{
    if(this.modify.value.question==='' || this.modify.value.question===null){
      question = { message: "¿Ha tenido " + this.modify.value.nombre + "?", type: "boolean"};
    }else{
      question = { message: this.modify.value.question, type: "boolean"}
    }
  } 

    let index_question = '';
   //console.log(this.modify.value.urgencia);
    if(this.modify.value.urgencia>=0.4 && (this.modify.value.index_question == '' || this.modify.value.index_question == null)){
      index_question = 'En un rango del 1 al 10 que tanta molestia le causa ' + this.modify.value.nombre;
    }else if(this.modify.value.urgencia>=0.4 && (this.modify.value.index_question != '' || this.modify.value.index_question != null)){
      index_question = this.modify.value.index_question;
    }else{
      index_question = '';
    }

    this.spinner.show();
    if(this.isChecked==false){
      this.values = new HttpParams()
      .set('nombre_sint', this.modify.value.nombre)
      .set('categoria_sint', this.modify.value.categoria)
      .set('descripcion', this.modify.value.descripcion)
      .set('keyWord', this.modify.value.keyword)
      .set('compuesto', 'false')
      .set('composicion', '')
      .set('nivel_urgencia', this.modify.value.urgencia)
      .set('body_zone', this.modify.value.body_zone)
      .set('porcentages', JSON.stringify(this.especializacionesSeleccionadas))
      .set('question', JSON.stringify(question))
      .set('index_question',index_question);
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
      .set('body_zone', this.modify.value.body_zone)
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
        this.sintServ.modificar(this.sintoma.hashId,this.values).subscribe((res:any) =>{
          //console.log("Ok", res)
          sessionStorage.setItem('token',res.body.token);
          this.toast.success('Se ha modificado el sintoma con éxito!', 'Modificación Exitosa!');
          this.spinner.hide();
        this.router.navigate(['/sintomas'])
      }, error =>{
          //console.log("Error", error.error);
          this.toast.error('Hubo un error al modificar el síntomas, favor de verificar la información', 'Error');
          this.spinner.hide();
      })
    }
  }

  creacionComposicion(){
    var id = this.modify.value.componentes;

    //console.log(id);

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
    //console.log(this.modify.value.composite)
    this.composicionFront = this.modify.value.composite;
    //console.log(this.composicionBack);
    //console.log(this.compuestos);
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

  ngDoCheck(){
    if(this.especializacionesSeleccionadas!=null){
    this.especializacionesSeleccionadas.forEach(element => {
      let espe = this.especializaciones.find(e => e.id == element.id);

      this.especializaciones = this.especializaciones.filter(function(value,index, arr){
        return value != espe;
      });
    });
  }
  }

  setPorcentage(espe : any,value : any){
    espe.porcentaje  = Number(value);
    if(value===""){
      this.isEmpty=true;
    }else{
      this.isEmpty=false;
    }
    this.totalPorcentage();
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
    if(this.modify.value.urgencia >= 0.4){
      this.hasIndex=true;
    }else{
      this.hasIndex=false;
    }
  }

  changeType(){
    if(this.modify.value.answerType=="Numérica"){
      this.expectsNumericAnswer=true;
      this.updateValidatorsForNumeric();  
    }else{
      this.expectsNumericAnswer=false;
      this.modify.get('question').setValidators([Validators.minLength(20), Validators.maxLength(120)]);
      this.modify.get('valorNum').clearValidators();
      this.modify.get('rango').clearValidators();
      this.modify.get('question').updateValueAndValidity();
      this.modify.get('valorNum').updateValueAndValidity();
      this.modify.get('rango').updateValueAndValidity();
    }
  }

  updateValidatorsForNumeric(){
    this.modify.get('question').setValidators([Validators.minLength(20), Validators.maxLength(120), Validators.required]);
    this.modify.get('valorNum').setValidators([Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]);
    this.modify.get('rango').setValidators([Validators.required]);
    this.modify.get('question').updateValueAndValidity();
    this.modify.get('valorNum').updateValueAndValidity();
    this.modify.get('rango').updateValueAndValidity();
  }
}
