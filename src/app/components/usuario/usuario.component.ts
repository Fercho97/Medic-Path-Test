import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [UsuarioService],
})
export class UsuarioComponent implements OnInit {
 pagina = 0;

  public users : Usuario[] = [];
  public doctors : Usuario[] = [];
  public patients : Usuario[] = [];
  key :string = 'nombres';
  reversa : boolean = false;
  myFilter;
  
  constructor(private userServ : UsuarioService, private http : HttpClient) { }

  ngOnInit() {
    document.getElementById("defaultOpen").click();
    this.userServ.getUsers().subscribe( (res: any) =>{

      for(let i =0;i<res.body.length;i++){
        if(res.body[i].tipoUsuario == 2){
        this.doctors.push(res.body[i]);
        }
        else if(res.body[i].tipoUsuario == 1){
          this.patients.push(res.body[i]);
        }
      }
      if(this.doctors.length!=0){
        
        console.log("Ok");
      }
      this.users = this.doctors;
      this.pagina=1;
    },
  error =>{
      console.log(error);
  })
  }

  changeTab(tipo : any){
        var i, tabcontent, links, active;
    
        if(tipo=="Paciente"){
          this.users=this.patients;
          this.pagina=1;
        }else{
          this.users=this.doctors;
          this.pagina=1;
        }

        tabcontent = document.getElementsByClassName("tabcontent");
        console.log(tabcontent);
        for (i = 0; i< tabcontent.length; i++){
            tabcontent[i].style.display = "none";
        }
    
        links = document.getElementsByClassName("tablinks");
        for (i = 0; i < links.length; i++){
            links[i].className = links[i].className.replace(" active", "");
        }
    
        document.getElementById(tipo).style.display = "block";
        active = document.getElementsByName(tipo);
        active[0].className += " active";
  }

  filtering(){
    this.pagina=1;
  }

  sorting(key : any){
    this.key = key;
    this.reversa = !this.reversa;
  }
}
