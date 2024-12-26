import { BehaviorSubject } from "rxjs";
import { Estado, Estudiante } from "../Entidades/Estudiante";
import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root',
})
export class TListaEstudiantes {
    private ListaEstudiantes: Estudiante[] = [
        new Estudiante('0703744', 'Bruno', 'Diaz', new Date('2000-01-12'), "Masculino", 1, 9, 8, 8.5, null, 8.5, 'Aprobado'),
        new Estudiante('0703745', 'Ana', 'Loja', new Date('2002-10-12'),"Femenino", 2, 4, 3, 3.5, null, 3.5, 'Reprobado')
    ];
    
    private estudiantesSubject = new BehaviorSubject<Estudiante[]>(this.ListaEstudiantes);
    estudiantes$ = this.estudiantesSubject.asObservable();

    constructor() {}

    getEstudiantes() {
        return this.estudiantesSubject.value;
    }

    addEstudiante(est: Estudiante) {
        if (this.verificarCodigoRepetido(est.codigo)==false) {
            this.ListaEstudiantes.push(est);
            this.estudiantesSubject.next(this.ListaEstudiantes);
        }
    }

    updateEstudiante(est: Estudiante) {
        const currentEstudiantes = this.estudiantesSubject.value;
        const index = currentEstudiantes.findIndex(e => e.codigo === est.codigo);
        if (index !== -1 ) {
            this.ListaEstudiantes[index] = est;
            this.estudiantesSubject.next(this.ListaEstudiantes);
            return true;
        } else {
            this.imprimirMensaje("Error","Ingrese un código de estudiante válido", "error");
            console.error('Estudiante no encontrado');
            return false;
        }
    }

    deleteEstudiante(index: number) {
        this.ListaEstudiantes.splice(index, 1);
        this.estudiantesSubject.next(this.ListaEstudiantes);
    }

    verificarCodigoRepetido(codigo: number): boolean {
        const currentEstudiantes = this.estudiantesSubject.value;
        let elementoRepetido = currentEstudiantes.find(
            (est: Estudiante) => est.codigo == codigo
        );
        if(elementoRepetido){
            return true;
        }else{
            return false;
        }
    }

    calcularCalificacionFinal(parcial1:number, parcial2:number): number {
        let calificacionFinal = (parcial1 + parcial2) / 2;
        return calificacionFinal;

    }

    calcularNotaDefinitiva(calificacionFinal:number, examenRecuperacion:number|null): number {
        let notaDefinitiva = calificacionFinal;
        if (examenRecuperacion != null) {
            notaDefinitiva = (calificacionFinal*0.4) + (examenRecuperacion*0.6);
        }
        return notaDefinitiva;

    }

    porcentajeAprobacion(){
        let aprobados = 0;
        let reprobados = 0;
        let totalEstudiantes = this.ListaEstudiantes.length;
        for (let i = 0; i < totalEstudiantes; i++) {
            if (this.ListaEstudiantes[i].estado == Estado.Aprobado) {
                aprobados++;
            } else if(this.ListaEstudiantes[i].estado == Estado.Reprobado) {
                reprobados++;
            }
        }
        let porcentajeAprobados = Number(((aprobados / totalEstudiantes) * 100).toFixed(2));
        let porcentajeReprobados = Number(((reprobados / totalEstudiantes) * 100).toFixed(2));
        return {porcentajeAprobados, porcentajeReprobados};
    }

    porcentajeAprobacionporSexo(){
        let aprobadosMasculinos = 0;
        let aprobadosFemeninos = 0;
        let totalMasculinos = 0;
        let totalFemeninos = 0;
        for(let i = 0; i < this.ListaEstudiantes.length; i++){

            if(this.ListaEstudiantes[i].sexo == "Masculino" ){
                totalMasculinos++;
            }

            if(this.ListaEstudiantes[i].sexo == "Femenino" ){
                totalFemeninos++;
            }

            if(this.ListaEstudiantes[i].sexo == "Masculino" && this.ListaEstudiantes[i].estado == Estado.Aprobado){
                aprobadosMasculinos++;
            }else if(this.ListaEstudiantes[i].sexo == "Femenino" && this.ListaEstudiantes[i].estado == Estado.Aprobado){
                aprobadosFemeninos++;
            }
        }
        let porcentajeAprobadosMasculinos= Number(((aprobadosMasculinos/totalMasculinos)*100).toFixed(2));
        let porcentajeAprobadosFemeninos= Number(((aprobadosFemeninos/totalFemeninos)*100).toFixed(2));

        if(isNaN(porcentajeAprobadosFemeninos)){
            porcentajeAprobadosFemeninos=0;
        }
        if(isNaN(porcentajeAprobadosMasculinos)){
            porcentajeAprobadosMasculinos=0;
        }

        return {porcentajeAprobadosMasculinos, porcentajeAprobadosFemeninos};
        
    }

    calcularPromedio(){
        let sumaCalificacion=this.ListaEstudiantes.reduce((total, est) => total + est.notaDefinitiva, 0);
        let totalEstudiantes = this.ListaEstudiantes.length;
        let promedio = Number((sumaCalificacion / totalEstudiantes).toFixed(2));
        return promedio;
    }

    obtenerEstudiantesNotaMayorPromedio(){
        let promedio = this.calcularPromedio();
        let estudiantesNotaMayorPromedio = this.ListaEstudiantes.filter(est => est.notaDefinitiva > promedio);
        return estudiantesNotaMayorPromedio;
    }


    imprimirMensaje(title:string, text:string, icon:any) {
        Swal.fire({
            title: title,
            html: text.replace(/\n/g, '<br>'),
            icon: icon,
            confirmButtonText: 'Aceptar'
        });
    }

    async imprimirMensajeConfirmacion(title: string, text: string, icon: any): Promise<boolean> {
        try {
            const result = await Swal.fire({
                title: title,
                text: text,
                icon: icon,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
            });
    
            if (result.isConfirmed) {
                await Swal.fire("Proceso exitoso", "", "success");
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en el mensaje de confirmación:', error);
            return false;
        }
    }



    


}
