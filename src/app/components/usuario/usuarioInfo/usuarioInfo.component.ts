import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../..../../../usuario/usuario.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuarioInfo',
  templateUrl: './usuarioInfo.component.html',
  styleUrls: ['./usuarioInfo.component.css'],
  providers: [UsuarioService],
})
export class UsuarioInfoComponent implements OnInit {
  
  public user : any = {} as any;
  constructor(private userServ : UsuarioService, private http : HttpClient, 
              private route : ActivatedRoute, private router : Router,
              private toast : ToastrService, private spinner : NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.userServ.getUser(this.route.snapshot.params.hash).subscribe( (res: any) =>{
      this.user = res.body.resultado;
      this.spinner.hide();
      //console.log(this.user);
    },
  error =>{
      this.spinner.hide();
      this.toast.error('Hubo un error al conseguir los detalles del usuaro, favor de intentarlo más tarde', 'Error')
      //console.log(error);
  })
  }
}
