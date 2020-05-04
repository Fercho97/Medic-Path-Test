import {Atomo} from './atomo.class';
import {Regla} from './regla.class';
import { MemoriaTrabajo } from './memoriaTrabajo.class';
import { Catalogos} from '../interfaces/catalogos.const';
import * as moment from 'moment-timezone';
export class Calculus{

     calculateCloseness(conocimientoEvaluado,baseConocimiento,memoriaDeTrabajo,minimumPorcent){
        let atomsInRule;
        let commonAtoms;
        let bestPorcentage = 0;
        let porcentage;
        let sintomasExtras = [];
        conocimientoEvaluado.forEach(element => {
           if(element[0].partesConclusion[0].obj==true){
          atomsInRule=0;
          commonAtoms=0;
          element[0].partesCondicion.forEach(parte =>{
            if(parte instanceof Atomo){
              atomsInRule++;
            }
            if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
              commonAtoms++;
            }
          });
          porcentage = commonAtoms * 100 / atomsInRule;
          if(porcentage >= minimumPorcent && porcentage != 100){
            let closeness = {padecimiento: element[0].partesConclusion[0].desc, porcentaje: Math.floor(porcentage)};
            sintomasExtras.push(closeness);
          }
        }
        });
        baseConocimiento.forEach(element => {
          if(element.partesConclusion[0].obj==true){
          atomsInRule=0;
          commonAtoms=0;
          element.partesCondicion.forEach(parte =>{
            if(parte instanceof Atomo){
              atomsInRule++;
            }
            if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
              commonAtoms++;
            }
          });
          porcentage = commonAtoms * 100 / atomsInRule;
          if(porcentage >= minimumPorcent && porcentage != 100){
            let closeness = {padecimiento: element.partesConclusion[0].desc, porcentaje: Math.floor(porcentage)};
            sintomasExtras.push(closeness);
          }
        }
        });
  
        sintomasExtras.sort(this.comparePorcentage);
        return sintomasExtras;
      }


      pathSelection(baseConocimiento : any, memoriaDeTrabajo : any){
        let bestStart;
        let atomsInRule;
        let commonAtoms;
        let bestPorcentage = 0;
        let porcentage;
        let index = 0;
        baseConocimiento.forEach((element:Regla)=> {
          atomsInRule=0;
          commonAtoms=0;
          index++;
          element.partesCondicion.forEach(parte =>{
            if(parte instanceof Atomo){
              atomsInRule++;
            }
            if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
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
        return null;
        //bestStart = Math.floor(Math.random() * baseConocimiento.length) + 1;
        }
        return bestStart-1;
      }

      getDifferencesBetweenNames(names : any, sint: any){
        let samewords : any = this.getSameWords(names, sint);
        let differences : any = [];
        let result = [];
        names.forEach(element => {
        let compareElement = element.split(" ");
          compareElement.forEach(word =>{
            if(samewords.indexOf(word)===-1)
              differences.push(word);
          })
        });
        
        result.push(differences);
        let text = samewords.join(' ');
        //console.log(text);
        result.push(text);
        return result;
      }

      getSameWords(names : any, sint :any){
       let sameWords : any = [];
        let compareTo = sint.split(" ");
        names.forEach(element => {
          if(element!==sint){
          let compareElement = element.split(" ");
          //console.log(compareElement);
            compareElement.forEach(word => {
              let index = compareTo.indexOf(word);
              if(index!=-1){
                if(sameWords.indexOf(word)==-1)
                    sameWords.push(word);
              }
            });
          }
          });
        return sameWords;
      }

      calculateRecommendation(memoriaDeTrabajo: any, sintomas: any){
        let resultados = [];
        //console.log(memoriaDeTrabajo.atomosAfirmados);
        memoriaDeTrabajo.atomosAfirmados.forEach((element:Atomo) => {
            let sintoma = sintomas.find(sint => sint.idSint == element.sintoma);
            if(sintoma!=undefined){
              if(sintoma.porcentages!=undefined){
              let porcentage = JSON.parse(sintoma.porcentages);
              
              porcentage.forEach(element => {
                let category = resultados.find(res => res['espe'] == element.nombre_esp);
                //console.log(category);
                if(category===undefined){
                  resultados.push({espe: element.nombre_esp, value: element.porcentaje});
                }else{
                  category.value = category.value + element.porcentaje;
                }
              });
            }
            }
        });
        let totales = memoriaDeTrabajo.atomosAfirmados.length-1;
        resultados.forEach(element => {
          let finalValue = Math.floor(element.value/totales);
          element.value = finalValue;
        });

        //console.log(resultados);

        resultados.sort(this.compare);
        if(resultados.length>2){
          resultados.length=2;
        }
        return resultados;
      }

       compare(a,b){
        if(a.value < b.value){
            return 1;
        }
        if(a.value > b.value){
            return -1;
        }
        return 0;
    }

    comparePorcentage(a,b){
      if(a.porcentaje < b.porcentaje){
        return 1;
      }
      if(a.porcentaje > b.porcentaje){
        return -1;
      }
      return 0;
    }

    userFeedbackRecommendation(historiales, sintomasUsuario,usuarioActual,resultado){

      let parecidos = [];
      let sintomasUser = sintomasUsuario.split(',');
      let especializaciones = [];
      let sintomasComun;
      let resultadoFinal;
      historiales.forEach(element => {
      if(element.usuario!=usuarioActual && element.padecimiento_final===resultado){
        let sameOnTheArray = parecidos.filter(item => item.usuario === element.usuario);

        //console.log(sameOnTheArray);

        let viable = this.checkPeriod(element.fecha_consulta,sameOnTheArray);
        if(viable==true){
          sintomasComun = 0;
          let sintomas = element.detalles_ids.split(",");
          sintomasUser.forEach(userSint =>{
            if(sintomas.some(atom => atom === userSint)){
              sintomasComun++;
            }
          })
          let porcentage = sintomasComun * 100 / sintomas.length;
          if(porcentage > 70){
            parecidos.push(element);
          }
          }
      }
      });
      
      parecidos.forEach(element =>{
        let category = especializaciones.find(res => res['espe'] == element.especialista_seleccionado);
                //console.log(category);
                if(category===undefined){
                  especializaciones.push({espe: element.especialista_seleccionado, value: 1});
                }else{
                  category.value = category.value + 1;
                }
      })

      especializaciones.sort(this.compare);

      return especializaciones;
    }

    orderByFirstLetter(usuarios: any){
      let letterOrder = Catalogos.LETTERS;
      let order: any = [];

      usuarios.forEach(element => {
        let index = letterOrder.find(letter => letter.value==element.fullname.charAt(0).toLowerCase());
        if(order[index.index]==undefined){
          order[index.index] = [];
        }

        order[index.index].push(element);
      });
      return order;
    }

    checkPeriod(date:any,compareTo:any){
      let formattedComparison = moment(moment(date).tz('America/Mexico_City').format('L'));
      let isViable = true;

      compareTo.forEach(element => {
          let dateToCompare = moment(moment(element.fecha_consulta).tz('America/Mexico_City').format('L'));

          let daysDiff = Math.abs(formattedComparison.diff(dateToCompare, 'days'))+1

          if(daysDiff<=3){
            isViable=false;
          }
      });
      return isViable;
    }
}