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
        "Resultados que te apoyaran a saber que es lo que padeces",
      li3: "Apoyado y valorado por médicos con mas de 30 años de carrera.",
      img: "assets/sintomas-main.jpg",
    },
    {
      header: "Queremos que te sientas seguro",
      li1:
        "Nuestro objetivo es brindarte confianza en los diagnósticos y llevar a cabo un seguimiento de tu estado de salud.",
      li2: "Puedes acceder desde cualquier dispositivo.",
      li3:
        "Contamos con una aplicación móvil para brindarte mayor comodidad y accesibilidad.",
      img: "assets/responsive-main.png",
    },
    {
      header: "Actualizamos nuestro sistema todo el tiempo",
      li1: "La página se actualiza para brindarte una mejor experiencia.",
      li2:
        "Con ayuda de expertos, ampliamos nuestros diagnósticos a diversas áreas.",
      li3:
        "Los médicos y especialistas brindan su conocimiento para hacer de este sistema mas fiable.",
      img: "assets/update-main.jpg",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
