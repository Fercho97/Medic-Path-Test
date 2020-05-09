import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent implements OnInit {
  images = [
    {
      img: "assets/faq.jpg",
    },
  ];

  active = false;

  botones = [];

  preguntas = [];

  respuestas = [];
  constructor() {
    for (let i = 0; i < 5; i++) {
      this.botones[i] = this.active;
    }

    this.preguntas[0] = "¿Qué somos?";
    this.preguntas[1] = "¿A qué nos dedicamos?";
    this.preguntas[2] = "¿Como funciona la página?";
    this.preguntas[3] = "¿Se necesita algún tipo de subscripción?";
    this.preguntas[4] = "¿Me equivoque al registrarme y puse algún dato personal erróneo, que hago?"

    this.respuestas[0] =
      "Un grupo que se encuentra dedicado al cuidado de la salud con el apoyo de los mejores especialistas en los campos de medicina";
    this.respuestas[1] =
      "Brindar información y apoyo para consultas médicas de nuestros usuarios";
    this.respuestas[2] =
      "Tan simple como registrarse y comenzar a disfrutar los beneficios y servicios de la página";
    this.respuestas[3] =
      "Por supuesto que no, la página y los servicios son totalmente gratuitos, no se necesita de suscripción ni nada por el estilo";
    this.respuestas[4] =
      "En ese caso le recomendamos ponerse en contacto en el siguiente correo: medicpath.services@gmail.com, allí se analizará su caso y le daremos una solución";
  }

  ngOnInit() {}

  showAnswer(id) {
    if (this.botones[id]) {
      this.botones[id] = false;
    } else {
      this.botones[id] = true;
    }
  }
}
