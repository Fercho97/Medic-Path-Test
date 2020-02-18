import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user;
  isAdmin = false;
  isDoctor = false;
  tipoUsuario = sessionStorage.getItem('tipoUsuario');
  constructor(private router : Router) { }

  ngOnInit() {
    this.user = false;
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
    console.log(sessionStorage.getItem('usuario'));
  }

  logout(){
    sessionStorage.clear();
    localStorage.setItem('action','logout');
    window.location.href='home';
  }

}
