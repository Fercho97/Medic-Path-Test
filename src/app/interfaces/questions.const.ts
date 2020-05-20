export class questions {
    public static QUESTIONS = {
        'fiebre' : [
          {type: 'numeric', message: '¿Cuál es o ha sido su temperatura corporal?', validValue: 38},
        ],
        'default' : [
          {type: 'boolean', message: ''},
        ],
        'deshidratación' : [
          {message: "¿Su secreción de liquidos(vomito,diarrea,sudoración) ha sido mayor a la cantidad de agua que ha ingerido ultimamente?", type: "boolean"}
        ],
        'encías color rojizo' : [
          {message: '¿Ha notado un color rojizo o bien diferente al color normal en sus encias?', type: "boolean"}
        ],
        'sangrado durante cepillado' : [
          {message: '¿Al cepillarse los dientes ha detectado sangrado?', type: "boolean"}
        ],
        'reacción alimentaria' : [
          {message: '¿Ha consumido algún alimento ultimamente que sienta que le haya caido mal?', type: "boolean"}
        ],
        'accesos en los dientes' : [
          {message: '¿Nota un agujero a simple vista en alguna pieza dental?', type: "boolean"}
        ],
        'reacción alérgenos' : [
          {message: '¿Ha estado en contacto con algún alérgenico ultimamente(polvo,polen,etc)?', type: "boolean"}
        ],
        'dientes manchados' : [
          {message: '¿Ha notado algúna mancha en sus dientes que persiste aún después de la limpieza?', type: "boolean"}
        ],
        'pérdida del apetito' : [
          {message: '¿Ultimamente ha tenido menos hambre de lo usual, o bien al comer siente que se llena más rápido?', type: "boolean"}
        ],
        'ganglios inflamados(cuello)' : [
          {message: '¿Al tocarse el cuello ha sentido inflamación o bien al hacer presión cerca de la parte superior del mismo le duele?', type: "boolean"}
        ],
        'manchas en amígdalas' : [
          {message: '¿Ha notado manchas en la parte posterior de la garganta?', type: "boolean"}
        ],
        'inflamación amígdalas' : [
          {message: '¿Ha notado inflamación en la parte posterior de la garganta?', type: "boolean"}
        ],
        'orina color oscuro' : [
          {message: '¿Ha notado que su orina ha sido de un color más oscuro últimamente?', type: "boolean"}
        ],
        'ictericia' : [
          {message: '¿Presenta una coloración amarillenta en alguna parte de la piel o bien en los ojos?', type: "boolean"}
        ],
        'dolor con desplazamiento hacia piernas' : [
          {message: '¿Su dolor de espalda se ha ido esparciendo hacia la zona baja del cuerpo?', type: "boolean"}
        ],
        'dolor por movimiento' : [
          {message: '¿Su dolor empeora con el movimiento?', type: "boolean"}
        ]

      }

      public static QUESTIONS_DOC = {
        'fiebre' : [
          {type: 'numeric', message: '¿Cuál es o ha sido la temperatura de su paciente?', validValue: 37},
        ],
        'default' : [
          {type: 'boolean', message: ''},
        ],
        'deshidratación' : [
          {message: "¿La secreción de liquidos(vomito,diarrea,sudoración) de su paciente ha sido mayor a la cantidad de agua que ha ingerido ultimamente?", type: "boolean"}
        ],
        'encías color rojizo' : [
          {message: '¿Se le nota un color rojizo o bien diferente al color normal en las encias?', type: "boolean"}
        ],
        'sangrado durante cepillado' : [
          {message: '¿Su paciente al cepillarse los dientes ha notado sangrado?', type: "boolean"}
        ],
        'reacción alimentaria' : [
          {message: '¿Su paciente identifica o noto que hubo algún alimento que le haya caido mal?', type: "boolean"}
        ],
        'accesos en los dientes' : [
          {message: '¿Nota un agujero a simple vista en alguna pieza dental del paciente?', type: "boolean"}
        ],
        'reacción alérgenos' : [
          {message: '¿Su paciente indica que ha estado en contacto con algún alérgenico ultimamente(polvo,polen,etc)?', type: "boolean"}
        ],
        'dientes manchados' : [
          {message: '¿Nota manchas visibles en los dientes de su paciente, las cuales no son provenientes de alimento?', type: "boolean"}
        ],
        'pérdida del apetito' : [
          {message: '¿Su paciente indica que ultimamente ha tenido menos hambre de lo usual, o bien al comer siente que se llena más rápido?', type: "boolean"}
        ],
        'ganglios inflamados(cuello)' : [
          {message: '¿Al palpar el cuello del paciente este presenta inflamación o bien al hacer presión cerca de la parte superior del mismo le duele?', type: "boolean"}
        ],
        'manchas en amígdalas' : [
          {message: '¿Se visualizan manchas en la parte posterior de la garganta de la garganta?', type: "boolean"}
        ],
        'inflamación amígdalas' : [
          {message: '¿Se puede notar inflamación en la parte posterior de la garganta del paciente?', type: "boolean"}
        ],
        'orina color oscuro' : [
          {message: '¿Su paciente ha notado que su orina es de un color más oscuro de lo habitual últimamente?', type: "boolean"}
        ],
        'ictericia' : [
          {message: '¿Su paciente tiene una coloración amarillenta perceptible en alguna parte de la piel o bien en los ojos?', type: "boolean"}
        ],
        'dolor con desplazamiento hacia piernas' : [
          {message: '¿El dolor de espalda de su paciente se ha ido esparciendo hacia la zona baja del cuerpo?', type: "boolean"}
        ],
        'dolor por movimiento' : [
          {message: '¿Su dolor empeora con el movimiento?', type: "boolean"}
        ]

      }

      public static MULTIQUESTIONS = {
        'dolor de cabeza': [
          {message: '¿Como describiría su dolor de cabeza?'}
        ],
        'hinchazón': [
          {message: '¿En que parte del cuerpo presenta hinchazón?'}
        ],
        'dolor abdominal' : [
          {message: '¿En que parte del abdomen presenta dolor?'}
        ]
      }

      public static MULTIQUESTIONS_DOC = {
        'dolor de cabeza': [
          {message: '¿Como describe su paciente su dolor de cabeza?'}
        ],
        'hinchazón': [
          {message: '¿En que parte del cuerpo presenta la hinchazón su paciente?'}
        ],
        'dolor abdominal' : [
          {message: '¿En que parte del abdomen presenta dolor el paciente?'}
        ]
      }

      public static SPECIFIC_NUMERIC_QUESTION = {
        'deshidratación' : [
          {message: 'Del 1 al 10 tanto se ve afectado por la falta de agua'}
        ],
        'debilidad': [
          {message: 'Del 1 al 10 indique que tanto afecta su vida diaria esta sensación de debilidad'}
        ],
        'ganglios inflamados(cuello)' : [
          {message: 'En escala de 1 al 10 ¿Qué tanto dolor siente en esa zona del cuello?'}
        ],
        'inflamación amígdalas' : [
          {message: 'En escala del 1 al 10 ¿Qué tanta molestia le causa la inflamación?'}
        ],
        'escalofrios' : [
          {message: 'En escala del 1 al 10 ¿Cómo describiría la intensidad de sus escalofríos?'}
        ],
        'dolor de cabeza punzante' : [
          {message: 'En un rango del 1 al 10 ¿Qué tan fuertes son las punzaciones que tiene?'}
        ],
        'dolor al tacto en espalda baja' : [
          {message: 'En un rango del 1 al 10 ¿Qué tan intenso es el dolor al tacto?'}
        ],
        'dolor con desplazamiento hacia piernas' : [
          {message: 'En un rango del 1 al 10 ¿Con que intensidad describiría dicho dolor?'}
        ],
        'dolor de espalda baja' : [
          {message: 'En una escala del 1 al 10 ¿Que tan intenso es su dolor de espalda?'}
        ]
      }

      public static SPECIFIC_NUMERIC_QUESTION_DOC = {
        'deshidratación' : [
          {message: '¿Del 1 al 10 que tanto se ve afectado su paciente por la deshidratación?'}
        ],
        'debilidad': [
          {message: 'En escala de 1 al 10 ¿Qué tanto indica su paciente que le afecta la pérdida de fuerza?'}
        ],
        'ganglios inflamados(cuello)' : [
          {message: 'En escala de 1 al 10 ¿Qué tanto dolor siente en esa zona del cuello su paciente?'}
        ],
        'inflamación amígdalas' : [
          {message: 'En escala del 1 al 10 ¿Qué tanta molestia le causa la inflamación en las amigdalas a su paciente?'}
        ],
        'escalofrios' : [
          {message: 'En escala del 1 al 10 ¿Qué tan intensos son los escalofríos en su paciente?'}
        ],
        'dolor al tacto en espalda baja' : [
          {message: 'En un rango del 1 al 10 ¿Qué tan intenso describe el dolor al tacto su paciente?'}
        ],
        'dolor con desplazamiento hacia piernas' : [
          {message: 'En un rango del 1 al 10 ¿Con que intensidad describe su paciente el dolor?'}
        ],
        'dolor de espalda baja' : [
          {message: 'En una escala del 1 al 10 ¿Que tan intenso es el dolor de espalda de su paciente?'}
        ]
      }
}