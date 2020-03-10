import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { DiagnosticService } from '../diagnostic/diagnostic.service';
import { Regla } from '../../inferencia/regla.class';
import { Atomo } from '../../inferencia/atomo.class';
import { MemoriaTrabajo } from '../../inferencia/memoriaTrabajo.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { SintomasService } from '../sintomas/sintomas.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { questions } from '../../interfaces/questions.const';
import { ErrorMsg } from '../../interfaces/errorMsg.const';
import { Calculus } from '../../inferencia/calculus.class';
import * as moment from 'moment-timezone';
moment.locale('es');
@Component({
  selector: 'app-guided-diagnostic',
  templateUrl: './guided-diagnostic.component.html',
  styleUrls: ['./guided-diagnostic.component.css'],
  providers: [DiagnosticService]
})

export class GuidedDiagnosticComponent implements OnInit {

  hasPregunta : boolean = false;
  descripcion : any = "";
  baseConocimiento : any[] = [];
  conocimientoEvaluado : any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  reglaEvaluar = new Regla();
  preguntas : any[] = [];
  atomosCondicion : Atomo[] = [];
  hasResult : boolean = false;
  breadcrumb : string = "";
  idResultado : string = '';
  selectedUser : boolean;
  calculusClass = new Calculus();
  public usuarios : any = [];
  public usuario : any;
  public iniciales : any = [];
  public sintomasSeleccionados : any = [];
  public sintomas : any = [];
  public isSelection : boolean = false;
  public descs : any = [];
  public nextObjective : any = [];
  question : any = {};
  public questionTypes = questions.QUESTIONS;
  public numeric : FormGroup;
  public errores_Diag = ErrorMsg.ERROR_DIAG;
  public atomos_opciones : any = [];
  public niveles : any = { "Ninguno" : [], "Bajo" : [], "Medio" : [], "Alto" : [], "Severo" : []};
  constructor(private diagServ : DiagnosticService, private toast : ToastrService,
              private router : Router, private sintServ : SintomasService) { 
                this.numeric = new FormGroup({
                  temp: new FormControl('', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]) 
                });
              }

  ngOnInit() {
    this.diagServ.obtenerUsuarios().subscribe((res: any) =>{
      console.log(res.body);
      this.usuarios = res.body.usuarios;
    })

    this.sintServ.getSints().subscribe(res =>{
      this.sintomas = res.body;
      this.iniciales = this.sintomas.filter(sintoma => sintoma['compuesto']==false);
    })
  }

  iniciarDiagnostico(){
    console.log("inicia")
    let mira : string = "";
    this.diagServ.consulta(mira).subscribe((res : any)  =>{
      //this.hasPregunta = true;
      console.log(res.body);
      
     res.body.reglas.forEach(element => {
        let rule = new Regla();
        this.baseConocimiento.push(rule.desgloseReglas(element));
      });

      console.log(this.baseConocimiento);
      this.hasPregunta = true;
      this.inferencia();
    }, error =>{
      this.toast.error("Hubo un error al conectarse con la base de datos", 'Error');
    })

    }

    inferencia(){
      let indice;
      if(this.nextObjective.length==0){
      indice = this.pathSelection();
      
      this.reglaEvaluar = this.baseConocimiento[indice];
      }else{
        this.reglaEvaluar = this.nextObjective.pop();
        indice = this.searchNextObjectiveCurrentIndex();
      }
      let middleAtomRule = this.hasMiddleAtom();
      if(middleAtomRule!=undefined){
        this.nextObjective.push(this.reglaEvaluar);
        //console.log(this.nextObjective);
        this.reglaEvaluar= this.baseConocimiento[middleAtomRule];
        indice=middleAtomRule;
      }

      this.conocimientoEvaluado.push(this.baseConocimiento.splice(indice,1));
        //console.log("Entro regla");
        //console.log(this.reglaEvaluar);
        for  (var element of this.reglaEvaluar.partesCondicion){
          //console.log(element);
          if(element instanceof Atomo){
            let almacenado = null;

            almacenado =  this.memoriaDeTrabajo.estaAlmacenado(element);
            console.log("Esta en la memoria?" + almacenado)
            if(almacenado===false){
            this.atomosCondicion.push(new Atomo(element.desc,element.estado,element.obj,element.padecimiento,element.sintoma));
            let question = this.questionGen(element.desc); 
            if(question!=null){
              this.preguntas.push(question);
            }else{
            this.preguntas.push({message: "¿Su paciente presenta " + element.desc + " ?", type: "boolean"});
            }
             this.descs.push(element.sintoma);
            }
          }
        };
        //console.log(this.atomosCondicion);
        //console.log(this.preguntas);
        if(this.preguntas.length!=0){
          this.mostrarPregunta();
          }
        else{
          this.analize();
        }
    }

    mostrarPregunta(){
      this.question = this.preguntas.pop();
      //console.log(this.question);
      if(this.question.type==='boolean'){
      let id = this.descs.pop();
      //console.log(id);
      
      let found = this.sintomas.find(item => item['idSint'].toString() === id);

      if(found!=undefined){
      this.descripcion = found.descripcion;
      }
    }
    }

    responder(resp : any){
      let atomoEvaluado = this.atomosCondicion.pop();
      if(resp=='Si'){
        atomoEvaluado.estado = true; 
        this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
        this.evaluateSypmtom(atomoEvaluado.sintoma);
      }
      else{
        atomoEvaluado.estado = false; 
      }
      this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);

      if(this.atomosCondicion.length>0 || this.preguntas.length>0){
        this.mostrarPregunta();
      }
      else{
        this.analize();
      }
    }

    analize(){
      let condicion = false;
      condicion = this.reglaEvaluar.checarCondicion(this.memoriaDeTrabajo)
      console.log(condicion);
      if(condicion===true){
        let atomos = this.reglaEvaluar.disparadorReglas(this.memoriaDeTrabajo)
        for(var atomo of atomos){
        this.memoriaDeTrabajo.almacenarAtomo(atomo);
        if(this.reglaEvaluar.objetivo===false)
        this.breadcrumb = this.breadcrumb + atomo.desc + "->"
        }

        if(this.reglaEvaluar.objetivo===true){
          this.question={message: "Su paciente padece de: " + this.reglaEvaluar.partesConclusion[0].desc }
          this.hasResult=true;
          this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
          this.checkUrgencyLevels();
            this.guardar();
          
        }
      }else{
        console.log("No se cumplio: " + this.reglaEvaluar.partesConclusion)
        for(var noCumplido of this.reglaEvaluar.partesConclusion){
          let atomoNoCumplido = new Atomo(noCumplido.desc,false,noCumplido.obj,noCumplido.padecimiento, noCumplido.sintoma);
          this.memoriaDeTrabajo.almacenarAtomo(atomoNoCumplido);
        }
      }
      
      console.log(this.memoriaDeTrabajo);
      console.log(this.baseConocimiento.length);
      if(this.baseConocimiento.length!=0 && this.hasResult==false){
      this.inferencia();
      }else if(this.hasResult==false){
        this.question={message: "Lo sentimos, no se pudo encontrar su padecimiento conforme sus respuestas"};
      }
    }

    guardar(){
      console.log("se envia");
      var fecha = moment().tz('America/Mexico_City').format();
      let values = new HttpParams()
      .set('detalles', this.breadcrumb.replace(/->/g,","))
      .set('usuario', this.usuario)
      .set('padecimiento_final', this.idResultado)
      .set('visible', 'true')
      .set('fecha', fecha.toString())
      .set('detalles_especificos', JSON.stringify(this.niveles));

      this.diagServ.guardarHistorial(values).subscribe(res =>{
        console.log("Ok", res)
        
      this.toast.success('Se ha guardado con éxito en el historial del paciente', 'Guardado Exitoso!');
      
    }, error =>{
        console.log("Error", error.error);
        this.toast.error(error.error, 'Error');
        this.router.navigate(['/landing'])
    })
    }

    selectUser(event : any){
      this.usuario = event.target.value;
      this.selectedUser=true;
    }

    selection(){
      this.isSelection=true;
    }

    cancel(){
      this.isSelection=false;
    }

    fromSintomasIniciales(){
      this.sintomasSeleccionados.forEach(element => {
        //Generar atomo
        let atomoRegla = new Atomo(element.nombre_sint,true,false,null,element.idSint);
        
        //Guardar en memoria de trabajo
        this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
        this.breadcrumb = this.breadcrumb + element.nombre_sint + "->"
      });

      this.avoidUnnecesaryQuestions();
      console.log(this.memoriaDeTrabajo);
     this.iniciarDiagnostico();
    }

    avoidUnnecesaryQuestions(){
      this.memoriaDeTrabajo.atomosAfirmados.forEach(sintoma =>{
        let multiOption = this.checkMultipleTypes(sintoma.desc);

        if(multiOption.length>1){
          multiOption.forEach(option =>{
            let atomo = new Atomo(option.nombre_sint,false,false,null,null);
            console.log(this.memoriaDeTrabajo.estaAfirmado(atomo));
            if(this.memoriaDeTrabajo.estaAlmacenado(atomo)===false){
              this.memoriaDeTrabajo.almacenarAtomo(atomo);
            }
          })
        }
      })
    }

    drop(event: CdkDragDrop<string[]>){
      if(event.previousContainer !== event.container){
        transferArrayItem(event.previousContainer.data,event.container.data,
                          event.previousIndex, event.currentIndex);
                          console.log(this.sintomasSeleccionados);
      }else{
        moveItemInArray(this.iniciales, event.previousIndex, event.currentIndex);
        console.log(this.sintomasSeleccionados);
      }
    }

    pathSelection(){
      let bestStart;
      let atomsInRule;
      let commonAtoms;
      let bestPorcentage = 0;
      let porcentage;
      let index = 0;
      this.baseConocimiento.forEach((element:Regla)=> {
        atomsInRule=0;
        commonAtoms=0;
        index++;
        element.partesCondicion.forEach(parte =>{
          if(parte instanceof Atomo){
            atomsInRule++;
          }
          if(this.memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
            commonAtoms++;
          }
        });
        porcentage = commonAtoms * 100 / atomsInRule;
        if(porcentage > bestPorcentage){
          bestPorcentage = porcentage;
          bestStart = index;
        }
      });
      if(bestStart==undefined){
      bestStart = Math.floor(Math.random() * this.baseConocimiento.length) + 1;
      }
      return bestStart - 1;
    }

    hasMiddleAtom(){
      let previousRuleIndex;
       this.reglaEvaluar.partesCondicion.forEach(condition => {
         if(!this.memoriaDeTrabajo.estaAlmacenado(condition)){
         this.baseConocimiento.forEach(function(rule,index){
           if((condition!="&") && (condition!="!")){
               if(condition.desc === rule.partesConclusion[0].desc){
                 previousRuleIndex = index;
                 
               }
           }
         });
       }
       });
 
       return previousRuleIndex;
     }
 
     searchNextObjectiveCurrentIndex(){
       let lastId;
       let currentObjective = this.reglaEvaluar.partesConclusion[0].desc;
       this.baseConocimiento.forEach(function(element, index) {
 
         if(currentObjective==element.partesConclusion[0].desc){
           lastId = index;
         }
       })
 
       return lastId;
     }

     questionGen(sint: any){
      
      let hasCertainQuestion = questions.QUESTIONS[sint.toLowerCase()];
      let multiOption = this.checkMultipleTypes(sint);
      if(hasCertainQuestion!=undefined){
        return hasCertainQuestion[0];
      }
      else if(multiOption.length>1){
        hasCertainQuestion = this.generateMultiOptionQuestion(multiOption,sint);
        return hasCertainQuestion;
      }
      else{
        return null;
      }
            
    }
      
      numericAnswer(){
        let expectedValue = this.question.validValue;

        let atomoEvaluado = this.atomosCondicion.pop();
        if(this.numeric.value.temp >= expectedValue){
          atomoEvaluado.estado = true; 
          this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
        }
        else{
          atomoEvaluado.estado = false; 
        }
        this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
  
        if(this.atomosCondicion.length>0){
          this.mostrarPregunta();
        }
        else{
          this.analize();
        }
      }

      evaluateSypmtom(symp : any){
        let atomSymp = this.sintomas.find(item => item['idSint'].toString() === symp);
        let sympIndex = this.sintomas.findIndex(item => item['idSint'].toString() === symp);
        if(atomSymp.nivel_urgencia==0.4){
          this.preguntas.push({message:'Del 1 al 10 que rango de molestia le causa a su paciente el tener ' + atomSymp.nombre_sint, type: 'scale', index: sympIndex});
        }
       }
  
       scaleAnswer(num : any, index : any){
      let atomSymp = this.sintomas[index];
      let calculatedUrgency = (atomSymp.nivel_urgencia*num)/4;
      this.sintomas[index].nivel_urgencia = calculatedUrgency;
      if(this.preguntas.length>0){
        this.mostrarPregunta();
        }else{
        this.analize();
        }
       }
  
       checkMultipleTypes(sint:any){
         let sintoma = this.sintomas.find(symp => symp['nombre_sint']==sint);
         let sameSynts = this.sintomas.filter(symp => symp['categoria_sint']==sintoma.categoria_sint && symp['keyWord']==sintoma.keyWord);
         return sameSynts;
       }
  
  
       generateMultiOptionQuestion(options :any, sint: any){
        var nombres:any = [];
  
        options.forEach(element => {
          nombres.push(element.nombre_sint);
        });
  
  
        let resultado = this.calculusClass.getDifferencesBetweenNames(nombres,sint);
  
        let diferencias = resultado[0];
  
        return {message: '¿Ha tenido ' + resultado[1] +"?", type: 'option', options: diferencias, normal: resultado[1], atoms: nombres}
       }
  
       optionAnswer(opciones: any, text : any, atomos : any, answer){
        //TODO en base a los datos de options generar los botones de manera dinámica, en base a los datos de atoms generar los atomos negados en caso de que no y el atomo aceptado en caso de que si.
        if(opciones.length<atomos.length){
          opciones.push('Simple');
        }
  
        console.log(atomos);
        //console.log(opciones.length);
        if(answer==="Si"){
          let optionSize = opciones.length;
          this.atomos_opciones.push( atomos.slice());
          console.log(this.atomos_opciones);
          let buttonOptions = [];
          for(var i = 0; i<optionSize; i++){
            let atomo = atomos.pop();
            let showOption = opciones.pop();
            let sintoma = this.sintomas.find(symp => symp['nombre_sint']==atomo);
            let button = {message: showOption, value: atomo, desc: sintoma.descripcion};
            buttonOptions.push(button);
          }
          console.log(buttonOptions);
          this.preguntas.push({message: "¿Como describe el paciente su " + text + "?",buttons: buttonOptions, type: 'selection'});
        }else{
          let atomoEvaluado = this.atomosCondicion.pop();
          atomoEvaluado.estado=false;
          this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
          atomos.forEach(atom =>{
            if(atom!==atomoEvaluado.desc){
              let negado = new Atomo(atom,false,false,null,null);
              this.memoriaDeTrabajo.almacenarAtomo(negado);
            }
          })
  
        }
        if(this.preguntas.length>0){
          this.mostrarPregunta();
          }else{
          this.analize();
          }
      }
  
      checkUrgencyLevels(){

        this.memoriaDeTrabajo.atomosAfirmados.forEach(atomo =>{
          let atomSymp = this.sintomas.find(item => item['nombre_sint'].toString() === atomo.desc);
          if(atomSymp!=null){
          console.log(atomSymp.nivel_urgencia);
          let sympLev = {sintoma: atomSymp.nombre_sint};
          if(atomSymp.nivel_urgencia>=0 && atomSymp.nivel_urgencia<0.2){
            this.niveles.Ninguno.push(sympLev);
          }else if(atomSymp.nivel_urgencia>=0.2 && atomSymp.nivel_urgencia<0.4){
            this.niveles.Bajo.push(sympLev);
          }else if(atomSymp.nivel_urgencia>=0.4 && atomSymp.nivel_urgencia<0.6){
            this.niveles.Medio.push(sympLev);
          }else if(atomSymp.nivel_urgencia>=0.6 && atomSymp.nivel_urgencia<0.8){
            this.niveles.Alto.push(sympLev);
          }else if(atomSymp.nivel_urgencia>=0.8 && atomSymp.nivel_urgencia<1){
            this.niveles.Severo.push(sympLev);
          }
          }
        })
       }

      selectedOption(selectedAtom : any){
        let atomoEvaluado = this.atomosCondicion.pop();
        let atom : any;
        if(atomoEvaluado.desc===selectedAtom){
          atomoEvaluado.estado=true;
          this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
          this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
        }else{
          let sint = this.sintomas.find(symp => symp['nombre_sint']==selectedAtom);
          atom = new Atomo(selectedAtom,true,false,null,sint.idSint);
          this.memoriaDeTrabajo.almacenarAtomo(atom);
          this.breadcrumb = this.breadcrumb + atom.desc + "->"
        }
  
        let opciones = this.atomos_opciones.pop();
        opciones.forEach(atomo =>{
          if(atomo!==selectedAtom){
            let negAtom = new Atomo(atomo,false,false,null,null);
            this.memoriaDeTrabajo.almacenarAtomo(negAtom);
          }
        })
  
        console.log(this.memoriaDeTrabajo)
        if(this.preguntas.length>0){
          this.mostrarPregunta();
          }else{
          this.analize();
          }
      }
}
