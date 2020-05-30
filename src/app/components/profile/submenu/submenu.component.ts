import { Component, OnInit } from '@angular/core';
import {CryptoStorage} from '../../../services/shared-service';
import {TokenService} from '../../../services/token-service';
@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {
  userType;
  constructor(private storage: CryptoStorage, private tokenServ : TokenService) { }

  ngOnInit() {
    this.userType = this.tokenServ.getRole();
    //this.storage.decryptData('tipoUsuario');
  }

}
