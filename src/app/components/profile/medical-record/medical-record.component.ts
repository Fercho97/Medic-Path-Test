import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import {Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicalRecordComponent } from './info-medical-record/info-medical-record.component';
import {CryptoStorage} from '../../../services/shared-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
  providers: [ProfileService,CryptoStorage]
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
              private storage: CryptoStorage, private spinner : NgxSpinnerService,
              private toast : ToastrService) { }

  ngOnInit() {
    this.spinner.show();
    let id = this.storage.decryptData('usuario');
    this.profileServ.historyList(id).subscribe( (res: any) =>{
      this.historiales = res.body.resultados;
      sessionStorage.setItem('token', res.body.token);
      this.spinner.hide();
      //console.log(this.historiales);
    },
  error =>{
     this.spinner.hide();
     this.toast.error('Hubo un error al conseguir la información de su historial, favor de recargar la página','Error')
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
