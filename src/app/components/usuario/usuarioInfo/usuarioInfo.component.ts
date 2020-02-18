import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../..../../../usuario/usuario.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario.interface';
@Component({
  selector: 'app-usuarioInfo',
  templateUrl: './usuarioInfo.component.html',
  styleUrls: ['./usuarioInfo.component.css'],
  providers: [UsuarioService],
})
export class UsuarioInfoComponent implements OnInit {
  
  public user : any = {} as any;
  constructor(private userServ : UsuarioService, private http : HttpClient, private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {
    this.userServ.getUser(this.route.snapshot.params.hash).subscribe( (res: any) =>{
      this.user = res.body.resultado;
      console.log(this.user);
    },
  error =>{
      console.log(error);
  })
  }
}
