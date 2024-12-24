export class Persona{
    cedula:string;
    nombres:string;
    apellidos:string;
    sexo:string;
    fechaNacimiento:Date;

    constructor(cedula:string, nombres:string, apellidos:string, fechaNacimiento:Date, sexo:string){
        this.cedula=cedula;
        this.nombres=nombres;
        this.apellidos=apellidos;
        this.fechaNacimiento=fechaNacimiento;
        this.sexo=sexo;
    }
}

