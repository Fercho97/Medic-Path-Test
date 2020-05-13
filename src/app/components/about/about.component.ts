import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  members = [
    {
      id: 1,
      nombres: "Cristopher Sinhue",
      apellidos: "Estrada Panduro",
      carrera: "Ingeniería en Computación",
      colaboracion: "Frontend Developer",
      url: "assets/panduro.jpg",
      objetivo:
        "Crear las interfaces mas llamativas e intuitivas para que los usuarios se sientan comodos al usar nuestro sistema",
      sueno:
        "Ser desarrollador Frontend, aprender distintos frameworks y lenguajes para destacar en la industria y aprender de todo, conseguir un buen trabajo y desempeñarme en lo que mas me gusta, lo cual es ser desarrollador",
      pasatiempos:
        "Jugar viddeojuegos, estudiar tecnologias nuevas y estar al dia de las nuevas tendencias tecnologicas",
    },
    {
      id: 2,
      nombres: "Fernando Martín",
      apellidos: "Jaime Ramírez",
      carrera: "Ingeniería en Informática",
      colaboracion: "Project Manager, Backend Developer",
      url: "assets/fercho.jpg",
      objetivo:
        "Gestionar, administrar, y asegurar la informacion del sistema, crear todo el Backend del sistema, asi como encargarme de la seguridad, solicitudes y acceso al sistema por parte del servidor, crear la aplicacion movil, encargarme de dirigir esta operacion y corregir sus errores",
      sueno:
        "Dirigir mas proyectos importantes en el area de desarrollo, contar con un equipo capaz y envidiable con quienes trabajar, aprender las nuevas tecnologias del desarrollo y crear sistemas nuevos e innovadores",
      pasatiempos:
        "Jugar Videojuegos, Aprender de nuevas tecnologias y tendencias en el area de desarrollo, Trabajar arduamente",
    },
    {
      id: 3,
      nombres: "Joel",
      apellidos: "Gonzalez Lara",
      carrera: "Ingeniería en Informática",
      colaboracion: "QA, Tester, Data Manager",
      url: "assets/profile-pic.jpg",
      objetivo:
        "Investigar, obtener y clasificar los datos para su procesamiento asi como brindar retroalimentacion para mejorar la experiencia de la plataforma",
      sueno:
        "Dedicarme a ser un Administrador de Bases de Datos, asi como brindar apoyo en diversos proyectos, gestionando y administrando la informacion y brindando mis conocimientos en las areas requeridas",
      pasatiempos:
        "Tomar cursos para aprender neuvas tecnologias, Jugar Videojuegos, Ver anime, Conocer Chicas",
    },
  ];

  constructor() {}

  ngOnInit() {}
}
