import { Component, OnInit } from '@angular/core';
import {CryptoStorage} from '../../../services/shared-service';
@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {
  userType;
  constructor(private storage: CryptoStorage) { }

  ngOnInit() {
    this.userType= this.storage.decryptData('tipoUsuario');
  }

}
