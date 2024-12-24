import { Persona } from "./Persona";

export class Estudiante extends Persona{
    codigo:number;
    parcial1:number;
    parcial2:number;
    calificacionFinal:number;
    examenRecuperacion:number | null;
    notaDefinitiva:number;
    estado:string;

    constructor(cedula:string, nombres:string, apellidos:string, fechaNacimiento:Date,sexo:string, codigo:number, parcial1:number, parcial2:number, calificacionFinal:number, examenRecuperacion:number|null, notaDefinitiva:number, estado:string){
        super(cedula, nombres, apellidos, fechaNacimiento, sexo);
        this.codigo=codigo;
        this.parcial1=parcial1;
        this.parcial2=parcial2;
        this.calificacionFinal=calificacionFinal;
        this.examenRecuperacion=examenRecuperacion;
        this.notaDefinitiva=notaDefinitiva;
        this.estado= estado;
    }

   

}

export enum Estado{
    Aprobado="Aprobado",
    Reprobado= "Reprobado"
}