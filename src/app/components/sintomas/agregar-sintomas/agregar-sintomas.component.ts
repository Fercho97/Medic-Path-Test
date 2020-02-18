import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMsg } from '../../../interfaces/errorMsg.const';
import { SymptomNameValidator } from '../../../validators/SymptomNameValidator';

@Component({
  selector: 'app-agregar-sintomas',
  templateUrl: './agregar-sintomas.component.html',
  styleUrls: ['./agregar-sintomas.component.css'],
  providers : [SintomasService, HttpClient]
})
export class AgregarSintomasComponent implements OnInit {

  mensajes_error = ErrorMsg.ERROR_MSG_SINT_PADS;
  sintomas: FormGroup;
  public  isChecked : boolean = false;
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
    }
  ];

  public compuestos : any = [];
  public selectedCompuestos : any = [];
  public composicionFront : string = "";
  public composicionBack : string = "";

  constructor(private sintServ : SintomasService, private router : Router, 
              private toast : ToastrService, private nameVal : SymptomNameValidator) {
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
    }else{
      this.nameToId();
      this.values = new HttpParams()
      .set('nombre_sint', this.sintomas.value.nombre)
      .set('categoria_sint', this.sintomas.value.categoria)
      .set('descripcion', this.sintomas.value.descripcion)
      .set('keyWord', this.sintomas.value.keyword)
      .set('compuesto', 'true')
      .set('composicion', this.composicionBack)
    }
    console.log(this.values);
    this.sintServ.createSintoma(this.values).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Se ha registrado el sintoma con éxito!', 'Registro Exitoso!');
    this.router.navigate(['/sintomas'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
  })
  }

  changed(evt){
    this.isChecked = evt.target.checked;
    console.log(evt.target.checked);
  }

  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer !== event.container){
      transferArrayItem(event.previousContainer.data,event.container.data,
                        event.previousIndex, event.currentIndex);
                        console.log(this.selectedCompuestos);
    }else{
      moveItemInArray(this.compuestos, event.previousIndex, event.currentIndex);
      console.log(this.selectedCompuestos);
    }
  }

  creacionComposicion(){
    var id = this.sintomas.value.componentes;

    console.log(id);

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
    console.log(this.sintomas.value.composite)
    this.composicionFront = this.sintomas.value.composite;
  }

  nameToId(){
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
}
