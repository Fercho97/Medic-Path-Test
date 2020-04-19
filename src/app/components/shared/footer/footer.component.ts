import { Component, OnInit } from '@angular/core';
import {CryptoStorage} from '../../../services/shared-service'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year: number = new Date().getFullYear();

  isDoctor;
  constructor(private storage: CryptoStorage) { }

  ngOnInit() {
    this.checkPermission();
  }

  checkPermission(){
    this.isDoctor = false;
    let tipoUsuario = this.storage.decryptData('tipoUsuario');
    

    if(tipoUsuario==='2'){
      this.isDoctor = true;
    }
  }
}
