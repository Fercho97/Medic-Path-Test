import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user;
  isAdmin;
  isDoctor;
  tipoUsuario;
  constructor(private router : Router) { }

  public ngOnInit() {
    this.checkPermission();
  }

  logout(){
    sessionStorage.clear();
    localStorage.setItem('action','logout');
    this.checkPermission();
    this.router.navigate(['/home']);
    
  }

  checkPermission(){
    this.user = false;
    this.isAdmin = false;
    this.isDoctor = false;
    this.tipoUsuario = sessionStorage.getItem('tipoUsuario');
    if(sessionStorage.getItem('usuario')!=null){
      this.user = true;
    }

    if(this.tipoUsuario==="2"){
      this.isDoctor = true;
    }
    else if(this.tipoUsuario=="3"){
      this.isAdmin = true;
    }
    console.log(this.isDoctor);
    console.log(this.isAdmin);
    console.log(sessionStorage.getItem('usuario'));
  }
}
