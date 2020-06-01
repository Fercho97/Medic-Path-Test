import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.css"],
})
export class CardsComponent implements OnInit {
  cards = [
    {
      title: "Consultas En línea",
      img: "assets/diagnostico-main.jpg",
      content:
        "Diagnósticos en base de tus síntomas que te permitirán saber que es lo pudieras padecer",
      anim: "fromRight"
    },
    {
      title: "Expedientes Clínicos",
      img: "assets/expediente-main.jpg",
      content:
        "Una vez registrado podrás acceder a los resultados de tus consultas desde tu perfil",
      anim: "downside"
    },
    {
      title: "Directorio Médico",
      img: "assets/medicos-main.jpg",
      content:
        "Un directorio médico el cual puede utilizar para ponerse en contacto con alguno de nuestros expertos",
      anim: "fromLeft"
    },
  ];
  constructor() {
  }

  ngOnInit(): void {}
}
