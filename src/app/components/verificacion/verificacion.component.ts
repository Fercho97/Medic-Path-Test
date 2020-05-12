import { VerificacionService } from "./verificacion.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Inject } from "@angular/core";

@Component({
  selector: "app-verificacion",
  templateUrl: "./verificacion.component.html",
  styleUrls: ["./verificacion.component.css"],
  providers: [VerificacionService],
})
export class VerificacionComponent implements OnInit {
  TextoH1: string = "";
  TextoLabel: string = "";
  constructor(
    @Inject(VerificacionService) private verifServ: VerificacionService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.verifyAccount(this.route.snapshot.params.hash);
  }

  verifyAccount(hash: any) {
    this.verifServ.verifyUser(hash).subscribe(
      (res: any) => {
        this.TextoH1 = "Su cuenta ha sido verificada con éxito!";
        this.TextoLabel = "Se le redigira a la página principal en 5 segundos";
      },
      (error: any) => {
        if (error.error == "Expiro") {
          this.TextoH1 = "Su link de validación expiro :(";
          this.TextoLabel =
            "Intente pidiendo un nuevo link, se le redigira a la página principal en 5 segundos";
        } else if (error.error == "No encontrado") {
          this.TextoH1 = "Link inexistente o utilizado";
          this.TextoLabel =
            "Se le redigira a la página principal en 5 segundos";
        }
      }
    );

    setTimeout(() => {
      this.router.navigate(["/home"]);
    }, 5000);
  }
}
