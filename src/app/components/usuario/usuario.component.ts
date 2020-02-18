import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [UsuarioService]
})
export class UsuarioComponent implements OnInit {
  pagina = 0;

  public users: Usuario[] = [];
  public doctors: Usuario[] = [];
  public patients: Usuario[] = [];
  key = 'fullname';
  reversa = false;
  public myFilter : any = "";
  public mySearch : any = "";
  public searching : boolean = false;
  constructor(private userServ: UsuarioService, private http: HttpClient) {}

  ngOnInit() {
    document.getElementById('defaultOpen').click();
    this.userServ.getUsers().subscribe(
      (res: any) => {
        sessionStorage.setItem('token',res.body.token);
        for (let i = 0; i < res.body.users.length; i++) {
          if (res.body.users[i].tipoUsuario === 2) {
            this.doctors.push(res.body.users[i]);
          } else if (res.body.users[i].tipoUsuario === 1) {
            this.patients.push(res.body.users[i]);
          }
        }
        if (this.doctors.length !== 0) {
          console.log('Ok');
        }
        this.users = this.doctors;
        this.pagina = 1;
      },
      error => {
        console.log(error);
      }
    );
  }

  changeTab(tipo: any) {
    let i;
    let tabcontent;
    let links;
    let active;
    this.myFilter="";
    this.mySearch="";
    if (tipo === 'Paciente') {
      this.users = this.patients;
      this.pagina = 1;
    } else {
      this.users = this.doctors;
      this.pagina = 1;
    }

    tabcontent = document.getElementsByClassName('tabcontent');
    console.log(tabcontent);
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    links = document.getElementsByClassName('tablinks');
    for (i = 0; i < links.length; i++) {
      links[i].className = links[i].className.replace(' active', '');
    }

    document.getElementById(tipo).style.display = 'block';
    active = document.getElementsByName(tipo);
    active[0].className += ' active';
  }

  filtering() {
    
  }

  sorting(key: any) {
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
