import { Component } from '@angular/core';
import { Estudiante } from '../../Entidades/Estudiante';
import { TListaEstudiantes } from '../../Controlador/TListaEstudiantes';
import { NgClass } from '@angular/common';
import { AgregarComponent } from '../agregar/agregar.component';


@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [NgClass, AgregarComponent],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent {
  //region atributos
  estudiantes:Estudiante[]=[];
  selectedEstudiante:Estudiante|null=null;
  isOpen:boolean=false;

  constructor(private OLista:TListaEstudiantes){}
  ngOnInit(){
      this.OLista.estudiantes$.subscribe((data)=>(this.estudiantes=data));

  }

  editEstudiante(oEstudiante:Estudiante)
   {
      this.selectedEstudiante={...oEstudiante};
      this.isOpen=true;
   }

   async deleteEstudiante(index:number)
   {
      const confirmar = await this.OLista.imprimirMensajeConfirmacion("Eliminar Estudiante", "¿Estás seguro de que deseas eliminar este estudiante?", "warning");
      if (confirmar) {
         console.log('Estudiante eliminado');
         this.OLista.deleteEstudiante(index);
      }
   }

   onCloseModal()
   {
      this.isOpen= false;
      this.selectedEstudiante= null;
   }

   mostarPorcentajeAprobacion(){
     if(this.estudiantes.length>0){
      let {porcentajeAprobados, porcentajeReprobados}= this.OLista.porcentajeAprobacion();
      let texto=`El porcentaje de aprobados es: ${porcentajeAprobados}% y el porcentaje de reprobados es: ${porcentajeReprobados}%`;
      this.OLista.imprimirMensaje("Aprobación de Estudiantes", texto, "success");
     }else{
      this.OLista.imprimirMensaje("Aprobación de Estudiantes", "No hay estudiantes registrados", "error");
     }
     
      
   }

   mostarPorcentajeAprobacionSexo(){
      if(this.estudiantes.length>0){
         let {porcentajeAprobadosMasculinos, porcentajeAprobadosFemeninos}= this.OLista.porcentajeAprobacionporSexo();
         let texto=`El porcentaje de aprobación del sexo masculino es: ${porcentajeAprobadosMasculinos}% y el porcentaje de aprobación del sexo femenino es: ${porcentajeAprobadosFemeninos}%`;
         this.OLista.imprimirMensaje("Aprobación de Estudiantes por Sexo", texto, "success");
      }else{
         this.OLista.imprimirMensaje("Aprobación de Estudiantes por Sexo", "No hay estudiantes registrados", "error");
      }

   }

   mostrarPromedio(){
      if(this.estudiantes.length>0){
         let promedio= this.OLista.calcularPromedio();
         let estudiantesNotaMayorPromedio= this.OLista.obtenerEstudiantesNotaMayorPromedio();
         let estudiantesNotaMayorPromedioTexto="";

         for(let estudiante of estudiantesNotaMayorPromedio){
            estudiantesNotaMayorPromedioTexto += `${estudiante.nombres} ${estudiante.apellidos}: ${estudiante.notaDefinitiva} \n`;
         }
         let texto = `El promedio de notas es: ${promedio}.\nEstudiantes con nota mayor al promedio:\n${estudiantesNotaMayorPromedioTexto}`;         this.OLista.imprimirMensaje("Promedio de Notas", texto, "success");
      }else{
        this.OLista.imprimirMensaje("Promedio de Notas", "No hay estudiantes registrados", "error");
      }
     
   }


}
