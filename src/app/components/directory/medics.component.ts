import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicComponent } from './info-medic/info-medic.component';
import {Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-medics',
  templateUrl: './medics.component.html',
  styleUrls: ['./medics.component.css'],
  providers: [UsuarioService]
})
export class MedicsComponent implements OnInit {

  medicos : any[] = [];
  pagina = 0;
  key :string = 'fullname';
  reversa : boolean = false;
  public myFilter : any = "";
  public mySearch : any = "";
  tipo = "all";
  hasEspe = false;
  public searching: boolean = false;
  constructor(private userServ : UsuarioService, private modalService : NgbModal, private route : ActivatedRoute) { }

  ngOnInit() {
    if(this.route.snapshot.params.type){
      this.tipo = this.route.snapshot.params.type
      this.hasEspe = true;
    }
    console.log(this.tipo);
    this.userServ.getDoctors(this.tipo).subscribe((res: any) =>{

      this.medicos = res.body;
      console.log(this.medicos);
    });
  }

  openModal(info, hash : any){
    const modalRef = this.modalService.open(InfoMedicComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.hash_doctor = hash;
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

  selection(medico: any){
    this.mySearch =medico;
    this.myFilter=medico;
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
