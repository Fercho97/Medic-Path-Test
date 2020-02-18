export interface Usuario{
    id: number,
    nickname: String,
    email: String,
    password: String,
    nombres: String,
    apellidos: String,
    sexo: String,
    tipoUsuario: number,
    createdAt: Date,
    actualizado: Date,
    enabled: Boolean,
    fecha_nacimiento: Date,
    telefono: String,
    direccion: String,
    imagen_perfil: String
}