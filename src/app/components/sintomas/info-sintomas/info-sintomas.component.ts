import { Component, OnInit, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SintomasService } from '../sintomas.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-info-sintomas',
  templateUrl: './info-sintomas.component.html',
  styleUrls: ['./info-sintomas.component.css'],
  providers: [SintomasService]
})
export class InfoSintomasComponent implements OnInit {

  @Input() public sintoma; 
  public compuesto = '';
  private values : HttpParams;
  constructor(public activeModal: NgbActiveModal, private sintServ : SintomasService) { 
   
  }

  ngOnInit() {
    this.compuesto = this.sintoma.compuesto;
    console.log(this.sintoma.composicion);
    if(this.sintoma.compuesto == true){

      this.values = new HttpParams()
      .set('composicion', this.sintoma.composicion);
      console.log(this.values);

      this.sintServ.getNames(this.values).subscribe( (res: any) =>{
        console.log(res.body);
        for(let item of res.body){
          this.sintoma.composicion = this.sintoma.composicion.replace(item.idSint,item.nombre_sint);
        }
      },
    error =>{
        console.log(error);
    })

    this.sintoma.composicion = this.sintoma.composicion.replace(/,/g,' ');
    this.sintoma.composicion = this.sintoma.composicion.replace(/&/g,'Y');
    }
    
  }

}
