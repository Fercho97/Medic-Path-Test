import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { Sintoma } from '../../../interfaces/sintoma.interface';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoSintomasComponent } from '../info-sintomas/info-sintomas.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listar-sintomas',
  templateUrl: './listar-sintomas.component.html',
  styleUrls: ['./listar-sintomas.component.css'],
  providers: [SintomasService],
  entryComponents : [InfoSintomasComponent]
})

export class ListarSintomasComponent implements OnInit {
  
 pagina = 0;
 public sintomas : Sintoma[] = [];
  key :string = 'nombre_sint';
  reversa : boolean = false;
  content;
  public myFilter : any = "";
  public mySearch : any = "";
  public searching: boolean = false;
  constructor(private sintServ : SintomasService, private http : HttpClient,
              private modalService: NgbModal, private spinner : NgxSpinnerService) { 

  }

  ngOnInit() {
    this.spinner.show();
    this.sintServ.getSints().subscribe( (res: any) =>{
      this.sintomas = res.body;

      if(this.sintomas){
        this.pagina = 1;
      }
      this.spinner.hide();
    },
  error =>{
    this.spinner.hide();
      //console.log(error);
  })
  }


  openModal(info, sint : any){
    const modalRef = this.modalService.open(InfoSintomasComponent, { windowClass : "myCustomModalClass"});
    //console.log(sint);
    modalRef.componentInstance.sintoma = sint;
  }

  filtering(){
    this.pagina=1;
  }

  sorting(key : any){
    this.key = key;
    this.reversa = !this.reversa;
  }

  showResults(event :any){
    if(event.target.value.length >= 1){
      this.searching= true;
    }else{
      this.searching=false;
    }
  }

  selection(name: any){
    this.mySearch =name;
    this.myFilter=name;
    this.pagina = 1;
    this.searching=false;
  }
  
  remove(){
    this.myFilter="";
    this.mySearch="";
    this.searching=false;
  }

  focusLost(){
    this.myFilter=this.mySearch;
  }
}
