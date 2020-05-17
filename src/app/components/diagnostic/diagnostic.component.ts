import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DiagnosticService } from "./diagnostic.service";
import { Regla } from "../../inferencia/regla.class";
import { Atomo } from "../../inferencia/atomo.class";
import { MemoriaTrabajo } from "../../inferencia/memoriaTrabajo.class";
import { ToastrService } from "ngx-toastr";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { SintomasService } from "../sintomas/sintomas.service";
import { questions } from "../../interfaces/questions.const";
import { Calculus } from "../../inferencia/calculus.class";
import { ErrorMsg } from "../../interfaces/errorMsg.const";
import * as moment from "moment-timezone";
moment.locale("es");
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SintSelectionComponent } from "./sintSelection/sintSelection.component";
import { CryptoStorage } from "../../services/shared-service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-diagnostic",
  templateUrl: "./diagnostic.component.html",
  styleUrls: ["./diagnostic.component.css"],
  providers: [DiagnosticService],
})
export class DiagnosticComponent implements OnInit {
  hasPregunta: boolean = false;
  question: any = {};
  descripcion: string = "";
  baseConocimiento: any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  conocimientoEvaluado: any[] = [];
  reglaEvaluar = new Regla();
  calculusClass = new Calculus();
  preguntas: any[] = [];
  atomosCondicion: Atomo[] = [];
  hasResult: boolean = false;
  breadcrumb: string = "";
  idResultado: string = "";
  user: boolean = false;
  public sintomas: any = [];
  public sintomasSeleccionados: any = [];
  public sintomasExtras: any = [];
  public iniciales: any = [];
  public sintomasResultado: any = [];
  public descs: any = [];
  public nextObjective: any = [];
  public niveles: any = {
    Ninguno: [],
    Bajo: [],
    Medio: [],
    Alto: [],
    Severo: [],
  };
  public numeric: FormGroup;
  public errores_Diag = ErrorMsg.ERROR_DIAG;
  public atomos_opciones: any = [];
  public isSelection: boolean = false;
  public fromSelected = false;
  public sintomasZona: any = [];
  public zoneSelection: any = [];
  public sintomasShow: any = [];
  public zone_options = ErrorMsg.Zone_options.options;
  public doc_recomendacion: any = [];
  public compare_historiales: any = [];
  public user_recommendation: any = [];
  public userId = "0";
  constructor(
    private diagServ: DiagnosticService,
    private toast: ToastrService,
    private router: Router,
    private sintServ: SintomasService,
    private modalService: NgbModal,
    private storage: CryptoStorage,
    private spinner: NgxSpinnerService
  ) {
    this.numeric = new FormGroup({
      temp: new FormControl("", [
        Validators.required,
        Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"),
      ]),
    });
  }

  image = [
    {
      img: "assets/Body.PNG",
    },
  ];

  ngOnInit() {
    if (this.storage.decryptData("usuario") != null) {
      this.user = true;
      this.userId = this.storage.decryptData("usuario");
      this.diagServ.withFeedback().subscribe((res: any) => {
        this.compare_historiales = res.body.resultado;
      });
    }

    this.sintServ.getSintsForDiagnostic().subscribe((res) => {
      this.sintomas = res.body;
      this.iniciales = this.sintomas.filter(
        (sintoma) => sintoma["compuesto"] == false
      );

      for (var zona of this.zone_options) {
        let zone_sints = this.sintomas.filter(
          (sintoma) =>
            sintoma["compuesto"] == false && sintoma["body_zone"] == zona
        );
        this.sintomasZona.push({ zone: zona, sintomas: zone_sints });
        this.zoneSelection.push({ zone: zona, sintomas: [] });
      }
    });
  }

  iniciarDiagnostico() {
    this.fromSelected = false;
    //console.log("inicia")
    let mira: string = "";
    this.diagServ.consulta(mira).subscribe(
      (res: any) => {
        //this.hasPregunta = true;
        //console.log(res.body);

        res.body.reglas.forEach((element) => {
          let rule = new Regla();
          this.baseConocimiento.push(rule.desgloseReglas(element));
        });

        //console.log(this.baseConocimiento);
        this.hasPregunta = true;
        this.inferencia();
      },
      (error) => {
        this.toast.error(
          "Hubo un error al conectarse con la base de datos",
          "Error"
        );
      }
    );
  }

  inferencia() {
    let indice;
    if (this.nextObjective.length == 0) {
      indice = this.calculusClass.pathSelection(
        this.baseConocimiento,
        this.memoriaDeTrabajo
      );
      if (indice == null) {
        this.noResultEnd();
      } else {
        this.reglaEvaluar = this.baseConocimiento[indice];
      }
    } else {
      this.reglaEvaluar = this.nextObjective.pop();
      indice = this.searchNextObjectiveCurrentIndex();
    }
    let middleAtomRule = this.hasMiddleAtom();
    if (middleAtomRule != undefined) {
      this.nextObjective.push(this.reglaEvaluar);
      //console.log(this.nextObjective);
      this.reglaEvaluar = this.baseConocimiento[middleAtomRule];
      indice = middleAtomRule;
    }

    this.conocimientoEvaluado.push(this.baseConocimiento.splice(indice, 1));
    for (var element of this.reglaEvaluar.partesCondicion) {
      //console.log(element);
      if (element instanceof Atomo) {
        let almacenado = null;

        almacenado = this.memoriaDeTrabajo.estaAlmacenado(element);
        //console.log("Esta en la memoria?" + almacenado)
        if (almacenado === false) {
          this.atomosCondicion.push(
            new Atomo(
              element.desc,
              element.estado,
              element.obj,
              element.padecimiento,
              element.sintoma
            )
          );
          let question = this.questionGen(element.desc);
          if (question != null) {
            this.preguntas.push(question);
          } else {
            this.preguntas.push({
              message: "¿Ha tenido " + element.desc + "?",
              type: "boolean",
            });
          }
          this.descs.push(element.sintoma);
        }
      }
    }
    //console.log(this.atomosCondicion);
    //console.log(this.preguntas);
    if (this.preguntas.length != 0) {
      this.mostrarPregunta();
    } else {
      this.analize();
    }
  }

  mostrarPregunta() {
    //console.log(this.preguntas);
    this.question = this.preguntas.pop();
    //console.log(this.question);
    if (this.question.type === "boolean" || this.question.type === "numeric") {
      let id = this.descs.pop();
      //console.log(id);

      let found = this.sintomas.find(
        (item) => item["idSint"].toString() === id
      );

      if (found != undefined) {
        this.descripcion = found.descripcion;
      }
    }
  }

  responder(resp: any) {
    this.spinner.show();
    let atomoEvaluado = this.atomosCondicion.pop();
    if (resp == "Si") {
      atomoEvaluado.estado = true;
      this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->";
      this.evaluateSypmtom(atomoEvaluado.sintoma);
    } else {
      atomoEvaluado.estado = false;
    }
    this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);

    if (this.atomosCondicion.length > 0 || this.preguntas.length > 0) {
      this.spinner.hide();
      this.mostrarPregunta();
    } else {
      this.spinner.hide();
      this.analize();
    }
  }

  analize() {
    let condicion = false;
    condicion = this.reglaEvaluar.checarCondicion(this.memoriaDeTrabajo);
    //console.log(condicion);
    if (condicion === true) {
      let atomos = this.reglaEvaluar.disparadorReglas(this.memoriaDeTrabajo);
      for (var atomo of atomos) {
        this.memoriaDeTrabajo.almacenarAtomo(atomo);
        if (this.reglaEvaluar.objetivo === false)
          this.breadcrumb = this.breadcrumb + atomo.desc + "->";
      }

      if (this.reglaEvaluar.objetivo === true) {
        this.showWhy();
      }
    } else {
      //console.log("No se cumplio: " + this.reglaEvaluar.partesConclusion)
      for (var noCumplido of this.reglaEvaluar.partesConclusion) {
        let atomoNoCumplido = new Atomo(
          noCumplido.desc,
          false,
          noCumplido.obj,
          noCumplido.padecimiento,
          noCumplido.sintoma
        );
        this.memoriaDeTrabajo.almacenarAtomo(atomoNoCumplido);
      }
    }
    if (this.baseConocimiento.length != 0 && this.hasResult == false) {
      this.inferencia();
    } else if (this.hasResult == false) {
      this.noResultEnd();
    }
  }

  noResultEnd() {
    this.hasResult = true;
    this.checkUrgencyLevels();
    if (this.memoriaDeTrabajo.atomosAfirmados.length != 0) {
      this.doc_recomendacion = this.calculusClass.calculateRecommendation(
        this.memoriaDeTrabajo,
        this.sintomas
      );
    }
    this.sintomasExtras = this.calculusClass.calculateCloseness(
      this.conocimientoEvaluado,
      this.baseConocimiento,
      this.memoriaDeTrabajo,
      40
    );
    if (this.sintomasExtras.length == 0) {
      if (this.memoriaDeTrabajo.atomosAfirmados.length <= 3) {
        this.question = {
          message:
            "Conforme la cantidad de síntomas que presenta no es posible llegar a una enfermedad en especifico, sin embargo es necesario que acuda con un médico si los sigue presentando o bien si estos empeoran",
        };
      } else {
        this.question = {
          message:
            "Debido a sus síntomas no fue posible el encontrar un padecimiento en especifico",
        };
      }
    } else {
      if (this.sintomasExtras[0].porcentaje >= 75 && this.user == true) {
        this.question = {
          message:
            "No se encontro un resultado en especifico, sin embargo por similitud de síntomas, encontramos que usted presenta un porcentaje elevado de tener " +
            this.sintomasExtras[0].padecimiento +
            " por lo tanto se guarda para observación",
        };
        this.idResultado = this.sintomasExtras[0].id;
        let comment =
          "Se guardo para observación ya que presento una similitud de sintomatología del " +
          this.sintomasExtras[0].porcentaje +
          " porciento con el resultado mostrado";
        let details = "";
        let detailsIds = "";
        this.memoriaDeTrabajo.atomosAfirmados.forEach((atomo) => {
          if (atomo.obj == false) {
            details = details + atomo.desc + ",";
            if (atomo.sintoma != null) {
              detailsIds = detailsIds + atomo.sintoma + ",";
            } else {
              let found = this.sintomas.find(
                (item) => item["nombre_sint"] == atomo.desc
              );
              detailsIds = detailsIds + found.idSint + ",";
            }
          }
        });
        this.guardar(details, detailsIds, comment);
        this.user_recommendation = this.calculusClass.userFeedbackRecommendation(
          this.compare_historiales,
          detailsIds,
          this.userId,
          this.idResultado
        );
      } else {
        this.question = {
          message:
            "Lo sentimos, no se ha podido encontrar un padecimiento en especifico conforme sus síntomas",
        };
      }
    }
  }

  guardar(details, detailsIds, comment) {
    var fecha = moment().tz("America/Mexico_City").format();
    let values = new HttpParams()
      .set("detalles", details)
      .set("usuario", this.userId)
      .set("padecimiento_final", this.idResultado)
      .set("visible", "true")
      .set("fecha", fecha.toString())
      .set("detalles_especificos", JSON.stringify(this.niveles))
      .set("recomendations", JSON.stringify(this.doc_recomendacion))
      .set("detallesIds", detailsIds)
      .set("comentario", comment);
    this.diagServ.guardarHistorial(values).subscribe(
      (res) => {
        //console.log("Ok", res)

        this.toast.success(
          "Se ha guardado con éxito en su historial",
          "Guardado Exitoso!"
        );
      },
      (error) => {
        //console.log("Error", error.error);
        this.toast.error(error.error, "Error");
        this.router.navigate(["/landing"]);
      }
    );
  }

  showWhy() {
    this.question = {
      message:
        "Usted padece de : " + this.reglaEvaluar.partesConclusion[0].desc,
    };
    this.hasResult = true;
    this.idResultado = this.reglaEvaluar.partesConclusion[0].padecimiento;
    this.reglaEvaluar.partesCondicion.forEach((element) => {
      if (element !== "&" && element !== "!") {
        this.sintomasResultado.push(
          this.memoriaDeTrabajo.estaAfirmado(element)
        );
      }
    });
    this.sintomasExtras = this.calculusClass.calculateCloseness(
      this.conocimientoEvaluado,
      this.baseConocimiento,
      this.memoriaDeTrabajo,
      70
    );
    this.checkUrgencyLevels();
    this.doc_recomendacion = this.calculusClass.calculateRecommendation(
      this.memoriaDeTrabajo,
      this.sintomas
    );
    let details = "";
    let detailsIds = "";
    this.memoriaDeTrabajo.atomosAfirmados.forEach((atomo) => {
      if (atomo.obj == false) {
        details = details + atomo.desc + ",";
        if (atomo.sintoma != null) {
          detailsIds = detailsIds + atomo.sintoma + ",";
        } else {
          let found = this.sintomas.find(
            (item) => item["nombre_sint"] == atomo.desc
          );
          detailsIds = detailsIds + found.idSint + ",";
        }
      }
    });

    if (this.user == true) {
      this.guardar(details, detailsIds, "");
    }
    this.user_recommendation = this.calculusClass.userFeedbackRecommendation(
      this.compare_historiales,
      detailsIds,
      this.userId,
      this.idResultado
    );
  }

  hasMiddleAtom() {
    let previousRuleIndex;
    this.reglaEvaluar.partesCondicion.forEach((condition) => {
      if (!this.memoriaDeTrabajo.estaAlmacenado(condition)) {
        this.baseConocimiento.forEach(function (rule, index) {
          if (condition != "&" && condition != "!") {
            if (condition.desc === rule.partesConclusion[0].desc) {
              previousRuleIndex = index;
            }
          }
        });
      }
    });

    return previousRuleIndex;
  }

  searchNextObjectiveCurrentIndex() {
    let lastId;
    let currentObjective = this.reglaEvaluar.partesConclusion[0].desc;
    this.baseConocimiento.forEach(function (element, index) {
      if (currentObjective == element.partesConclusion[0].desc) {
        lastId = index;
      }
    });

    return lastId;
  }

  fromSintomasIniciales() {
    this.sintomasSeleccionados.forEach((element) => {
      //Generar atomo
      let sint = this.sintomas.find(
        (sintoma) => sintoma["idSint"].toString() === element.toString()
      );
      let atomoRegla = new Atomo(
        sint.nombre_sint,
        true,
        false,
        null,
        sint.idSint
      );
      //console.log(atomoRegla);
      //Guardar en memoria de trabajo
      this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
      this.breadcrumb = this.breadcrumb + sint.nombre_sint + "->";
      this.evaluateSypmtom(atomoRegla.sintoma);
    });

    this.avoidUnnecesaryQuestions();
    //console.log(this.memoriaDeTrabajo);
    if (this.preguntas.length > 0) {
      this.hasPregunta = true;
      this.fromSelected = true;
      this.mostrarPregunta();
    } else {
      this.iniciarDiagnostico();
    }
  }

  avoidUnnecesaryQuestions() {
    this.memoriaDeTrabajo.atomosAfirmados.forEach((sintoma) => {
      let multiOption = this.checkMultipleTypes(sintoma.desc);

      if (multiOption.length > 1) {
        multiOption.forEach((option) => {
          let atomo = new Atomo(option.nombre_sint, false, false, null, null);
          //console.log(this.memoriaDeTrabajo.estaAfirmado(atomo));
          if (this.memoriaDeTrabajo.estaAlmacenado(atomo) === false) {
            this.memoriaDeTrabajo.almacenarAtomo(atomo);
          }
        });
      }
    });
  }

  checkUrgencyLevels() {
    this.memoriaDeTrabajo.atomosAfirmados.forEach((atomo) => {
      let atomSymp = this.sintomas.find(
        (item) => item["nombre_sint"].toString() === atomo.desc
      );
      if (atomSymp != null) {
        //console.log(atomSymp.nivel_urgencia);
        let reason = "";
        if (atomSymp.hasOwnProperty("reason")) {
          reason = atomSymp.reason;
        }

        let sympLev = {
          sintoma: atomSymp.nombre_sint,
          descripcion: atomSymp.descripcion,
          reason: reason,
        };
        if (atomSymp.nivel_urgencia >= 0 && atomSymp.nivel_urgencia < 0.2) {
          this.niveles.Ninguno.push(sympLev);
        } else if (
          atomSymp.nivel_urgencia >= 0.2 &&
          atomSymp.nivel_urgencia < 0.4
        ) {
          this.niveles.Bajo.push(sympLev);
        } else if (
          atomSymp.nivel_urgencia >= 0.4 &&
          atomSymp.nivel_urgencia < 0.6
        ) {
          this.niveles.Medio.push(sympLev);
        } else if (
          atomSymp.nivel_urgencia >= 0.6 &&
          atomSymp.nivel_urgencia < 0.8
        ) {
          this.niveles.Alto.push(sympLev);
        } else if (
          atomSymp.nivel_urgencia >= 0.8 &&
          atomSymp.nivel_urgencia < 1
        ) {
          this.niveles.Severo.push(sympLev);
        }
      }
    });
  }

  questionGen(sint: any) {
    let hasCertainQuestion = questions.QUESTIONS[sint.toLowerCase()];
    let multiOption = this.checkMultipleTypes(sint);
    if (hasCertainQuestion != undefined) {
      return hasCertainQuestion[0];
    } else if (multiOption.length > 1) {
      hasCertainQuestion = this.generateMultiOptionQuestion(multiOption, sint);
      return hasCertainQuestion;
    } else {
      return null;
    }
  }

  numericAnswer() {
    let expectedValue = this.question.validValue;

    let atomoEvaluado = this.atomosCondicion.pop();
    if (this.numeric.value.temp >= expectedValue) {
      atomoEvaluado.estado = true;
      this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->";
    } else {
      atomoEvaluado.estado = false;
    }
    this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);

    if (this.atomosCondicion.length > 0) {
      this.mostrarPregunta();
    } else {
      this.analize();
    }
  }

  evaluateSypmtom(symp: any) {
    let atomSymp = this.sintomas.find(
      (item) => item["idSint"].toString() === symp.toString()
    );

    let sympIndex = this.sintomas.findIndex(
      (item) => item["idSint"].toString() === symp.toString()
    );
    if (atomSymp.nivel_urgencia == 0.4 || atomSymp.nivel_urgencia == 0.6) {
      let question = "";
      let hasSpecificQuestion =
        questions.SPECIFIC_NUMERIC_QUESTION[atomSymp.nombre_sint.toLowerCase()];
      if (hasSpecificQuestion != null) {
        question = hasSpecificQuestion[0].message;
      } else {
        question =
          "Del 1 al 10 que rango de molestia le causa el tener " +
          atomSymp.nombre_sint;
      }

      this.preguntas.push({
        message: question,
        type: "scale",
        index: sympIndex,
      });
    }
  }

  scaleAnswer(num: any, index: any) {
    this.spinner.show();
    let atomSymp = this.sintomas[index];
    let calculatedUrgency = (atomSymp.nivel_urgencia * num) / 4;
    this.sintomas[index].nivel_urgencia = calculatedUrgency;
    this.sintomas[index].reason =
      "Esto debido a que usted lo indico con una intensidad de " + num;
    if (this.preguntas.length > 0) {
      this.spinner.hide();
      this.mostrarPregunta();
    } else if (this.fromSelected == true) {
      this.spinner.hide();
      this.iniciarDiagnostico();
    } else {
      this.spinner.hide();
      this.analize();
    }
  }

  checkMultipleTypes(sint: any) {
    let sintoma = this.sintomas.find((symp) => symp["nombre_sint"] == sint);
    let sameSynts = this.sintomas.filter(
      (symp) =>
        symp["categoria_sint"] == sintoma.categoria_sint &&
        symp["keyWord"].toLowerCase() == sintoma.keyWord.toLowerCase()
    );
    return sameSynts;
  }

  generateMultiOptionQuestion(options: any, sint: any) {
    var nombres: any = [];

    options.forEach((element) => {
      nombres.push(element.nombre_sint);
    });

    let resultado = this.calculusClass.getDifferencesBetweenNames(
      nombres,
      sint
    );

    let diferencias = resultado[0];

    return {
      message: "¿Ha tenido " + resultado[1] + "?",
      type: "option",
      options: diferencias,
      normal: resultado[1],
      atoms: nombres,
    };
  }

  optionAnswer(opciones: any, text: any, atomos: any, answer) {
    //console.log(opciones.length);
    if (answer === "Si") {
      let atomsSize = atomos.length;
      this.atomos_opciones.push(atomos.slice());
      //console.log(this.atomos_opciones);
      let buttonOptions = [];
      for (var i = 0; i < atomsSize; i++) {
        let showOption = "";
        let atomo = "";

        if (opciones.length != 0) {
          showOption = opciones.pop();
          let index = atomos.findIndex((atom) => atom.includes(showOption));
          let found = atomos.splice(index, 1);
          atomo = found[0];
        } else {
          showOption = "General";
          atomo = atomos.pop();
        }
        let sintoma = this.sintomas.find(
          (symp) => symp["nombre_sint"] == atomo
        );
        let button = {
          message: showOption,
          value: atomo,
          desc: sintoma.descripcion,
        };
        buttonOptions.push(button);
      }
      //console.log(buttonOptions);
      let messageShow = questions.MULTIQUESTIONS[text.toLowerCase()];
      this.preguntas.push({
        message: messageShow[0].message,
        buttons: buttonOptions,
        type: "selection",
      });
    } else {
      let atomoEvaluado = this.atomosCondicion.pop();
      atomoEvaluado.estado = false;
      this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
      atomos.forEach((atom) => {
        if (atom !== atomoEvaluado.desc) {
          let negado = new Atomo(atom, false, false, null, null);
          this.memoriaDeTrabajo.almacenarAtomo(negado);
        }
      });
    }
    if (this.preguntas.length > 0) {
      this.mostrarPregunta();
    } else {
      this.analize();
    }
  }

  selectedOption(selectedAtom: any) {
    let atomoEvaluado = this.atomosCondicion.pop();
    let atom: any;
    let atomId: any;
    if (atomoEvaluado.desc === selectedAtom) {
      atomoEvaluado.estado = true;
      this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
      this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->";
      atomId = atomoEvaluado.sintoma;
    } else {
      let sint = this.sintomas.find(
        (symp) => symp["nombre_sint"] == selectedAtom
      );
      atomId = sint.idSint;
      atom = new Atomo(selectedAtom, true, false, null, sint.idSint);
      this.memoriaDeTrabajo.almacenarAtomo(atom);
      this.breadcrumb = this.breadcrumb + atom.desc + "->";
    }

    let opciones = this.atomos_opciones.pop();
    opciones.forEach((atomo) => {
      if (atomo !== selectedAtom) {
        let negAtom = new Atomo(atomo, false, false, null, null);
        this.memoriaDeTrabajo.almacenarAtomo(negAtom);
      }
    });
    this.evaluateSypmtom(atomId);
    //console.log(this.memoriaDeTrabajo)
    if (this.preguntas.length > 0) {
      this.mostrarPregunta();
    } else {
      this.analize();
    }
  }

  selection() {
    this.isSelection = true;
  }

  cancel() {
    this.isSelection = false;
  }

  selectSintomas(label: any) {
    const modalRef = this.modalService.open(SintSelectionComponent, {
      windowClass: "myCustomModalClass fadeIn",
    });

    let zoneSints = this.sintomasZona.find((zone) => zone["zone"] == label);
    let selectedZone = this.zoneSelection.find((zone) => zone["zone"] == label);

    //console.log(zoneSints['sintomas']);
    modalRef.componentInstance.selectableSints = zoneSints.sintomas;
    modalRef.componentInstance.sintomasSeleccionados = selectedZone.sintomas;
    modalRef.componentInstance.zone = label;

    modalRef.result.then((result) => {
      for (let zone of this.zoneSelection) {
        if (zone["zone"] === label) {
          zone["sintomas"] = result;
        }
      }
      this.showSymptoms();
    });
  }

  showSymptoms() {
    let zones: any = [];
    for (let zone of this.zoneSelection) {
      zones = zones.concat(zone.sintomas);
    }
    //console.log(zones);
    this.sintomasSeleccionados = zones;

    this.sintomasShow = this.diagServ.showSymtoms(
      this.sintomasSeleccionados,
      this.sintomas
    );
  }
}
