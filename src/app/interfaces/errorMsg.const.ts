export class ErrorMsg {
  public static ERROR_MSG_REGISTER = {
    nickname: [
      {
        type: "required",
        message: "Es necesario el ingresar un nombre de usuario",
      },
      {
        type: "minlength",
        message: "El nombre de usuario debe ser mayor a 3 caracteres",
      },
      {
        type: "maxlength",
        message: "El nombre de usuario debe ser menor a 20 caracteres",
      },
      { type: "userTaken", message: "Usuario en uso, intente con otro" },
      {
        type: "pattern",
        message:
          "El nombre de usuario solo puede contener letras y números, evitando caracteres especiales o puros espacios",
      },
    ],
    nombre: [
      { type: "required", message: "El nombre es necesario" },
      {
        type: "minlength",
        message: "La longitud debe ser mayor a 3 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 50 caracteres",
      },
      {
        type: "pattern",
        message:
          "El nombre debe contener letras, evitando números, caracteres especiales o bien puros espacios",
      },
    ],
    apellido: [
      { type: "required", message: "El apellido es necesario" },
      {
        type: "minlength",
        message: "La longitud debe ser mayor a 3 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 50 caracteres",
      },
      {
        type: "pattern",
        message:
          "El apellido debe contener letras, evitando números, caracteres especiales o bien puros espacios",
      },
    ],
    correo: [
      { type: "required", message: "Es necesario ingresar un correo" },
      {
        type: "pattern",
        message: "El texto ingresado no representa un correo",
      },
      { type: "emailTaken", message: "Correo en uso, intente con otro" },
      { type: "nonExisting", message: "Correo no existente en el sistema" },
    ],
    fechanacimiento: [
      { type: "required", message: "Debe seleccionar una fecha" },
      {
        type: "isFutureDate",
        message: "Debe elegir una fecha anterior a la actual",
      },
      {
        type: "noValidAge",
        message:
          "Usted no cumple con los requisitos de edad para el uso del sistema",
      },
    ],
    password: [
      { type: "required", message: "Debe ingresar una contraseña" },
      {
        type: "minlength",
        message: "La contraseña debe tener más de 5 caracteres",
      },
    ],
    passwordVerif: [{ type: "required", message: "Valide su contraseña" }],
    same_password: [
      { type: "equalPasswords", message: "Las contraseñas no son iguales" },
    ],
    telefono: [
      {
        type: "required",
        message: "Es necesario ingresar un número telefonico",
      },
      {
        type: "minlength",
        message: "Es necesario ingresar un número teléfonico con 10 caracteres",
      },
      {
        type: "maxlength",
        message:
          "La cantidad de digitos para el número telefonico debe ser menor a 15",
      },
      { type: "pattern", message: "Solo ingrese números" },
    ],
    direccion: [
      {
        type: "required",
        message: "Es necesario ingresar un domicilio para el médico",
      },
    ],
  };

  public static ERROR_MSG_SINT_PADS = {
    nombreSint: [
      {
        type: "required",
        message: "Es necesario ingresar el nombre del síntoma",
      },
      {
        type: "minlength",
        message: "El nombre del síntoma debe ser mayor a 3 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 50 caracteres",
      },
      { type: "nameUsed", message: "Ya existe un síntoma con este nombre" },
      {
        type: "pattern",
        message:
          "El nombre del síntoma debe contener solo letras, no debe iniciar o terminar con espacios o bien estar compuesto de puros espacios",
      },
    ],
    descripcion: [
      { type: "required", message: "Es necesario ingresar una descripción" },
      {
        type: "minlength",
        message: "La descripción debe ser mayor a 20 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 200 caracteres",
      },
      {
        type: "pattern",
        message:
          "La descripción puede contener letras, números, puntos y comas, no debe iniciar o terminar con espacios o bien estar compuesta de puros espacios",
      },
    ],
    categoria: [
      {
        type: "required",
        message: "Es necesario el seleccionar una categoría",
      },
    ],
    urgencia: [
      {
        type: "required",
        message:
          "Es necesario el seleccionar un nivel de urgencia para el síntoma",
      },
    ],
    especializacion: [
      {
        type: "required",
        message:
          "Es necesario el seleccionar una especialización para el padecimiento",
      },
    ],
    nombrePad: [
      {
        type: "required",
        message: "Es necesario ingresar el nombre del padecimiento",
      },
      {
        type: "minlength",
        message: "El nombre del padecimiento debe ser mayor a 4 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 50 caracteres",
      },
      {
        type: "nameUsed",
        message: "Ya existe un padecimiento con este nombre",
      },
      {
        type: "pattern",
        message:
          "El nombre del padecimiento debe contener solo letras, no debe iniciar o terminar con espacios o bien estar compuesto de puros espacios",
      },
    ],
    keyword: [
      {
        type: "required",
        message: "Es necesario ingresar una palabra clave para el síntoma",
      },
      {
        type: "minlength",
        message: "La palabra clave debe ser mayor a 4 caracteres",
      },
      {
        type: "maxlength",
        message: "La longitud debe ser menor a 30 caracteres",
      },
      {
        type: "pattern",
        message:
          "La palabra clave puede contener solo números y letras, no debe iniciar o terminar con espacios o bien estar compuesto de puros espacios",
      },
    ],
    body_zone: [
      {
        type: "required",
        message: "Es necesario elegir una zona para el síntoma",
      },
    ],
  };

  public static ERROR_DIAG = {
    temp: [
      { type: "required", message: "Es necesario ingresar su temperatura" },
      { type: "pattern", message: "Ingrese una cantidad válida" },
    ],
  };

  public static Zone_options = {
    options: ["Cabeza", "Abdomen", "Corporal", "Pecho", "Garganta y Cuello"],
  };
}
