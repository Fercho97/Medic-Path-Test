import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.css"],
})
export class CardsComponent implements OnInit {
  cards = [
    {
      title: "Consultas En linea",
      img: "assets/diagnostico-main.jpg",
      content:
        "Tienes la oportunidad de diagnosticarte en linea, con una precisión de mas del 98%, gracias a la inteligencia artificial",
    },
    {
      title: "Expedientes Clínicos",
      img: "assets/expediente-main.jpg",
      content:
        "Podrás acceder a tus consultas y diagnósticos médicos en cualquier momento",
    },
    {
      title: "Directorio Médico",
      img: "assets/medicos-main.jpg",
      content:
        "Un directorio médico al cual puede acceder y ponerse en contacto con alguno de nuestros expertos",
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
