import {Atomo} from './atomo.class';
import {MemoriaTrabajo} from './memoriaTrabajo.class';
import {PilaBooleana} from './pilaBooleana.class';

export class Regla{
partesCondicion : Array<any>;
partesConclusion : Array<any>;
marca : Boolean;
disparo : Boolean;
objetivo : Boolean;

 constructor(){
    this.partesCondicion= [];
    this.partesConclusion= [];
    this.marca=false;
    this.disparo=false;
    this.objetivo=false;
 }

 checarCondicion(memoria){
    let memoriaTrabajo = new MemoriaTrabajo();
    memoriaTrabajo = memoria;
    let pila = new PilaBooleana();
    let verdadInicial=false,verdadComparacion=false;

    for (var condicion of this.partesCondicion){
        if(condicion instanceof Atomo){
            let atomoTemporal= new Atomo(condicion.desc,condicion.estado,condicion.obj,condicion.padecimiento,condicion.sintoma);
            let atomoMemoria =  memoriaTrabajo.obtenerAtomo(atomoTemporal);
                verdadInicial=atomoTemporal.estado&&atomoMemoria.estado;
                pila.push(verdadInicial);
        }
        else if(condicion=== "~"){
                verdadInicial=pila.datos.pop();
                verdadInicial=!verdadInicial;
                pila.push(verdadInicial);
        }
        else if(condicion=== "&"){
            verdadInicial=pila.datos.pop();

            verdadComparacion=pila.datos.pop();

            pila.push(verdadInicial&&verdadComparacion);
        }
        else if(condicion=== "|"){
            
            verdadInicial=pila.datos.pop();

            verdadComparacion=pila.datos.pop();

            pila.push(verdadInicial||verdadComparacion);
        }
    };

    return pila.datos.pop();

}

disparadorReglas(mt){
    console.log("Se llego al disparador");
    let atomoTemporal=null;
    let esObjetivo=false;
    this.disparo=true;
    let atomos=[];
    for (var element of this.partesConclusion){
        if(element instanceof Atomo){
            atomoTemporal=element;
            atomos.push(atomoTemporal);
            if(atomoTemporal.objetivo) esObjetivo=true;
        }else if(element=== "~"){
            atomoTemporal.estado=!atomoTemporal.estado;
        }
    };
    console.log("Termina Disparador");
    return atomos;
}


desgloseReglas(regla : any){
    let partes = regla.atomos.split(",");
    let conclusion = regla.atomo_conclusion.split(",");
    let ids =regla.atomos_ids.split(',');
    let negado = false;
    let unions = [];
    let concUnions = [];
    let obj = false;
    let pad = regla.ailment;
    if(regla.es_obj==1){
        obj = true;
    }

    this.objetivo=obj;
if(partes.indexOf("!")===-1){
    for(let ind = partes.length; ind>0; ind--){
    let indice = Math.floor(Math.random() * partes.length);
    let parte = partes.splice(indice,1);
    console.log(parte);
    let id = ids.splice(indice,1);
        switch(parte[0]){  
            case "!": negado = true;
                      break;

            case "&": unions.push(parte[0]);
                      break;
            
            case "|": unions.push(parte[0]);
                                  break;

            default: 
                let atomoRegla = new Atomo(parte[0],true,false,null,id[0]);
                this.partesCondicion.push(atomoRegla);
                if(negado==true){
                    this.partesCondicion.push("~");
                    negado=false;
                }
            break;
        }
    }
}
else{
    let indice = 0;
    partes.forEach(parte =>{
        indice++;
        switch(parte){  
            case "!": negado = true;
                      break;

            case "&": unions.push(parte);
                      break;
            
            case "|": unions.push(parte);
                                  break;

            default: 
                let atomoRegla = new Atomo(parte,true,false,null,ids[indice-1]);
                this.partesCondicion.push(atomoRegla);
                if(negado==true){
                    this.partesCondicion.push("~");
                    negado=false;
                }
            break;
        }
    });
}
    unions.forEach(char => {
        this.partesCondicion.push(char);
    });

    conclusion.forEach(conc =>{
        switch(conc){  
            case "!": negado = true;
                      break;

            case "&": concUnions.push(conc);
                      break;
            
            case "|": concUnions.push(conc);
                      break;

            default: 
                let atomoRegla = new Atomo(conc,true,obj,pad,null);
                this.partesConclusion.push(atomoRegla);
                if(negado==true){
                    this.partesConclusion.push("~");
                    negado=false;
                }
            break;
        }
    });

    concUnions.forEach(char => {
        this.partesConclusion.push(char);
    });

    return this;
  }

}