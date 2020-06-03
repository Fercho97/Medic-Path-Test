import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicalRecordComponent } from './info-medical-record/info-medical-record.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../../services/token-service';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
  providers: [ProfileService,TokenService]
})
export class MedicalRecordComponent implements OnInit {

  pagina = 0;
  public historiales : any[] = [];
  key :string = 'padecimiento_final';
  reversa : boolean = false;
  public myFilter : any = "";
  public mySearch : any = "";
  public searching : boolean = false;
  content;
  constructor(private profileServ : ProfileService, private modalService : NgbModal,
              private spinner : NgxSpinnerService, private toast : ToastrService,
              private tokenServ : TokenService) { }

  ngOnInit() {
    this.spinner.show();
    let id = this.tokenServ.getId();
    //console.log(id);
    this.profileServ.historyList(id).subscribe( (res: any) =>{
      this.historiales = res.body.resultados;
      sessionStorage.setItem('token', res.body.token);
      this.spinner.hide();
      //console.log(this.historiales);
    },
  error =>{
     this.spinner.hide();
     if(error.error.message==undefined){
     this.toast.error('Hubo un error al conseguir la información de su historial, favor de recargar la página','Error')
     }else{
      this.toast.error(error.error.message,'Error');
     } 
     //console.log(error);
  })
  }

  filtering(){
    this.pagina=1;
  }

  sorting(key : any){
    this.key = key;
    this.reversa = !this.reversa;
  }

  openModal(info, hist : any){
    const modalRef = this.modalService.open(InfoMedicalRecordComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.historial = hist;
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
