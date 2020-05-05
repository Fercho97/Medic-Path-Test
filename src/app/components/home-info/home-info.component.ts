import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home-info",
  templateUrl: "./home-info.component.html",
  styleUrls: ["./home-info.component.css"],
})
export class HomeInfoComponent implements OnInit {
  contents = [
    {
      header: "Evaluar tus síntomas es muy fácil",
      li1:
        "Señala los síntomas utilizando la herramienta didáctica e intuitiva.",
      li2:
        "Contamos con presicion del 99% gracias a nuestros algoritmos de Inteligencia Artificial.",
      li3: "Apoyado y valorado por medicos con mas de 30 años de carrera.",
      img: "assets/sintomas-main.jpg",
    },
    {
      header: "Queremos que te sientas seguro",
      li1:
        "Nuestro objetivo es brindarte confianza en los diagnosticos y llevar a cabo un seguimiento de tu estado de salud.",
      li2: "Puedes acceder desde cualquier dispositivo.",
      li3:
        "Contamos con una aplicacion movil para brindarte mayor comodidad y accesibilidad.",
      img: "assets/responsive-main.png",
    },
    {
      header: "Actualizamos nuestro sistema todo el tiempo",
      li1: "La pagina se actualiza para brindarte una mejor experiencia.",
      li2:
        "Con ayuda de expertos, ampliamos nuestros diagnosticos a diversas areas.",
      li3:
        "Los medicos y especialistas brindan su conocimiento para hacer de este sistema mas fiable.",
      img: "assets/update-main.jpg",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
