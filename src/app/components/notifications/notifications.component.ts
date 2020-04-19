import { Component, OnInit } from '@angular/core';
import {CryptoStorage} from '../../services/shared-service';
import {NotificacionService} from './notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoMedicalRecordComponent } from '../profile/medical-record/info-medical-record/info-medical-record.component';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificacionService,CryptoStorage]
})
export class NotificationsComponent implements OnInit {
  public notificaciones = [];
  content;
  constructor(private notifServ : NotificacionService, private storage: CryptoStorage, private modalService : NgbModal) {
   }

  ngOnInit() {
    this.loadNotif();

  }


  openModal(info, hist : any){
    const modalRef = this.modalService.open(InfoMedicalRecordComponent, { windowClass : "myCustomModalClass"});
    modalRef.componentInstance.historial = hist;
  }

  loadNotif(){
    let hashCryp = this.storage.decryptData('hash');
    console.log(hashCryp);
    this.notifServ.getWithoutFeedback(hashCryp).subscribe( (res: any) =>{
      console.log(res.body.resultados);
      this.notificaciones = res.body.resultados;
    },
  error =>{
      console.log(error);
  })
  }
}
