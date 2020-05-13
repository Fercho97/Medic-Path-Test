import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-politics",
  templateUrl: "./politics.component.html",
  styleUrls: ["./politics.component.css"],
})
export class PoliticsComponent implements OnInit {
  politics = [
    {
      title: "CALIDAD",
      parraph:
        "Es nuestro compromiso ofrecer consultas médicas que satisfagan las necesidades y cumplan las expectativas de nuestros pacientes y darle oportunidad a los médicos participantes de que demuestren sus conocimientos ante diversos pacientes y les permitan competir con éxito en mercados cada vez más globalizados, exigentes y cambiantes. Nuestra organización se fundamenta en el mejoramiento y aprendizaje continuo, todo para cumplir con las responsabilidades adquiridas. Nos apoyamos utilizando la ayuda de diversos médicos especializados en diferentes áreas y especialidades, médicos comprometidos con los objetivos de Medic Path, poseedores de una gran calidad humana y solvencia moral.",
    },
    {
      title: "SEGURIDAD",
      parraph:
        "Medic Path basando en las políticas de sistema de gestión de seguridad de la información (SGSI) es responsable de aprobar una política de seguridad de la información que asegure los siguientes puntos:",
    },
    {
      title: "SERVICIO",
      parraph:
        "Dentro de este apartado se define el nivel de compromiso que Medic Path asume con los pacientes o usuarios al objeto de cumplir con los niveles de servicio en cuanto a disponibilidad y tiempo de respuesta. A continuación se definen los 3 puntos de servicio que están integrados de forma estándar:",
    },
    {
      title: "Consultoria",
      parraph:
        "Medic Path se compromete a dar respuesta a dudas relacionadas con el uso del sistema, gestión de cuentas, soporte, fallas y errores en el servicio en menos de 24hrs.",
    },
    {
      title: "Registro de médicos en el sistema",
      parraph:
        "Medic Path se compromete a realizar el registro de nuevos médicos interesados a colaborar, creando un perfil único en menos de 24hrs por medio del cual aportarán información al sistema para generar retroalimentación proactiva, beneficiando a los usuarios y proporcionando información de contacto directo.",
    },
    {
      title: "Realización de consultas médicas",
      parraph:
        "Medic Path se compromete a ofrecer un diagnóstico preciso y seguro en menos de 3 minutos, el cual se basará en los síntomas mencionados por el usuario.",
    },
  ];

  contenidos = [
    {
      subtittle: "Impactos y prioridades",
      content1:
        "La prioridad se establecerá en relación a la tipología del asunto. Priorizando aquellos casos de parada total del sistema o problemas en funcionamiento en BD.",
      content2:
        "La prioridad se establecerá en relación a su importancia para la realización de nuevos resultados.",
      content3:
        "No existen prioridades para la realización de consultas médicas.",
    },

    {
      subtittle: "Excepciones a la cláusula",
      content1:
        "Dicho servicio no es aplicable fuera del horario de servicio. Ante causas de fuerza mayor y no posibilidad de respuesta ante problemas de carácter general y cuando por algún problema la no respuesta no puede ser atribuible a Medic Path. El tiempo de respuesta sólo será contabilizado respecto al horario de servicio y siempre en días laborales.  La contabilización del tiempo de respuesta empezará a correr sólo en el horario de servicio.",
      content2:
        "Dicho servicio no es aplicable fuera del horario de servicio. Ante causas de fuerza mayor y realización de actualizaciones en el sistema no se podrán realizar el registro de nuevos médicos. El tiempo de respuesta sólo será contabilizado respecto al horario de servicio y siempre en días laborales.  La contabilización del tiempo de respuesta empezará a correr sólo en el horario de servicio.",
      content3:
        "Ante la realización de actualizaciones en el sistema no se podrán realizar consultas médicas.",
    },

    {
      subtittle: "Gestión de reclamaciones",
      content1:
        "Los usuarios podrán realizar las reclamaciones que estime oportunas en relación al cumplimiento del servicio a través de cualquiera de los medios puestos al efecto: ",
      content2:
        "Los usuarios podrán realizar las reclamaciones que estime oportunas en relación al cumplimiento del servicio a través de cualquiera de los medios puestos al efecto: ",
      content3:
        "Los usuarios podrán realizar las reclamaciones que estime oportunas en relación al cumplimiento del servicio a través de cualquiera de los medios puestos al efecto:",
    },
  ];

  data = [
    {
      telefono: "3323106919",
      email: "medicpath.services@gmail.com",
    },
  ];

  points = [
    {
      uno:
        "La información estará protegida contra cualquier acceso no autorizado.",
      dos:
        "La confidencialidad de la información, especialmente aquella relacionada con los datos de carácter personal de los médicos y pacientes.",
      tres:
        "La integridad de la información se mantendrá en relación a la clasificación de la información (especialmente la de “uso interno”).",
      cuatro:
        "La disponibilidad de la información cumple con los tiempos relevantes para el desarrollo de los procesos críticos de las consultas",
      cinco:
        "Se cumplen con los requisitos de las legislaciones y reglamentaciones vigentes, especialmente con la Ley de Protección de Datos y de Firma Electrónica.",
      seis:
        "La capacitación en materia de seguridad se cumple y se actualiza suficientemente para todos los administradores.",
      siete:
        "Todos los eventos que tengan relación con la seguridad de la información, reales como supuestos, se comunicarán al responsable de seguridad y serán investigados.",
      ocho: "No se obtendrá ningún dato domiciliario de los pacientes",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
