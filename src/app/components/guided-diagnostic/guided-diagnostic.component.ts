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
  public usuarios : any = [];
  public usuario : any;
  public iniciales : any = [];
  public sintomasSeleccionados : any = [];
  public isSelection : boolean = false;
  public descs : any = [];
  public nextObjective : any = [];
  question : any = {};
  public questionTypes = questions.QUESTIONS;
  public numeric : FormGroup;
  public errores_Diag = ErrorMsg.ERROR_DIAG;
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

    this.sintServ.getComponents().subscribe(res =>{
      this.iniciales = res.body;
      console.log(this.iniciales);
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
            this.atomosCondicion.push(new Atomo(element.desc,element.estado,element.obj,element.padecimiento));
            let question = this.questionGen(element.desc); 
            if(question!=null){
              this.preguntas.push(question);
            }else{
            this.preguntas.push({message: "¿Ha tenido " + element.desc + " ?", type: "boolean"});
            }
             this.descs.push(element.desc);
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
      let id = this.descs.pop();
      this.question = this.preguntas.pop();
      this.descripcion = this.iniciales.find(item => item['nombre_sint'].toString() === id);
    }

    responder(resp : any){
      let atomoEvaluado = this.atomosCondicion.pop();
      if(resp=='Si'){
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
          this.question={message: "Usted padece de : " + this.reglaEvaluar.partesConclusion[0].desc }
          this.hasResult=true;
          this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
            this.guardar();
          
        }
      }else{
        console.log("No se cumplio: " + this.reglaEvaluar.partesConclusion)
        for(var noCumplido of this.reglaEvaluar.partesConclusion){
          let atomoNoCumplido = new Atomo(noCumplido.desc,false,noCumplido.obj,noCumplido.padecimiento);
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
      let values = new HttpParams()
      .set('detalles', this.breadcrumb.replace(/->/g,","))
      .set('usuario', this.usuario)
      .set('padecimiento_final', this.idResultado)
      .set('visible', 'true');

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
        let atomoRegla = new Atomo(element.nombre_sint,true,false,null);
        
        //Guardar en memoria de trabajo
        this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
        this.breadcrumb = this.breadcrumb + element.nombre_sint + "->"
      });

     this.iniciarDiagnostico();
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

      if(hasCertainQuestion!=undefined){
        return hasCertainQuestion[0];
      }else{
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
}
