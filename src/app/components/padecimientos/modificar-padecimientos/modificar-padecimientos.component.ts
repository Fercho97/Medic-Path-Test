import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PadecimientoService } from '../padecimientos.service';
import { SintomasService } from '../../sintomas/sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Padecimiento } from '../../../interfaces/padecimiento.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-modificar-padecimientos',
  templateUrl: './modificar-padecimientos.component.html',
  styleUrls: ['./modificar-padecimientos.component.css'],
  providers: [SintomasService, PadecimientoService]
})
export class ModificarPadecimientosComponent implements OnInit {

  modify: FormGroup;

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
  selectedFile : File = null;
  formData: any = new FormData();
  public  hasInfo : boolean = false;
  public urlImage : string = "../../../../assets/default-image.jpg";
  constructor(private padServ : PadecimientoService, private sintServ : SintomasService, private toast : ToastrService, private router : Router, private url : ActivatedRoute) {
    this.modify = new FormGroup({
      nombre: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      sintomas: new FormControl(''),
      imagen : new FormControl(''),
      sintomasSeleccionados : new FormControl('')
    });
  }

  ngOnInit() {
    this.sintServ.getSints().subscribe( (res: any) =>{
      this.sintomas = res.body;
    },
  error =>{
      console.log(error);
  })

  this.padServ.getPad(this.url.snapshot.params.hash).subscribe( (res : any) =>{
    console.log(res.body);
    this.padecimiento = res.body.padecimiento;
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
  
    
    this.padServ.updatePadecimiento(this.formData, this.url.snapshot.params.hash).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Se ha registrado el padecimiento con éxito!', 'Registro Exitoso!');
    this.router.navigate(['/padecimientos'])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
  })
  }

}
