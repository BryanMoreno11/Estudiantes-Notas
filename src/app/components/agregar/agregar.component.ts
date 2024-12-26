import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Estudiante, Estado } from '../../Entidades/Estudiante';
import { TListaEstudiantes } from '../../Controlador/TListaEstudiantes';
@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  @Input() isOpen = false;
  @Input() selectedEstudiante: Estudiante | null = null;
  @Output() close = new EventEmitter<void>();

  oEstudiante: Estudiante = {
    codigo: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: new Date(),
    sexo:"Masculino",
    parcial1: 0,
    parcial2: 0,
    calificacionFinal: 0,
    examenRecuperacion: null,
    notaDefinitiva: 0,
    estado: Estado.Reprobado  
  };

  constructor(private listaEstudiantes: TListaEstudiantes) {}

  public resetEstudiante() {
    this.oEstudiante = {
      codigo: 0,
      cedula: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: new Date(),
      sexo:"Masculino",
      parcial1: 0,
      parcial2: 0,
      calificacionFinal: 0,
      examenRecuperacion: null,
      notaDefinitiva: 0,
      estado: Estado.Reprobado
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedEstudiante'] && this.selectedEstudiante) {
      this.oEstudiante = { ...this.selectedEstudiante };
      console.log(this.oEstudiante);
    } else if (!this.selectedEstudiante) {
      this.resetEstudiante();
    }
  }


  onChangesParcial(){
    this.oEstudiante.calificacionFinal= this.listaEstudiantes.calcularCalificacionFinal(this.oEstudiante.parcial1, this.oEstudiante.parcial2);
    this.oEstudiante.calificacionFinal= Number(this.oEstudiante.calificacionFinal.toFixed(2));
    this.oEstudiante.notaDefinitiva= this.oEstudiante.calificacionFinal;
    this.oEstudiante.notaDefinitiva= Number(this.oEstudiante.notaDefinitiva.toFixed(2));
    if(this.oEstudiante.calificacionFinal<5.5 || this.oEstudiante.calificacionFinal>=7){
      this.oEstudiante.examenRecuperacion=null;
    }
    if(this.oEstudiante.notaDefinitiva>=7){
      this.oEstudiante.estado=Estado.Aprobado;
    }else{
      this.oEstudiante.estado=Estado.Reprobado;
    }
  }

  onChangesExamenRecuperacion(){
    this.oEstudiante.notaDefinitiva= this.listaEstudiantes.calcularNotaDefinitiva(this.oEstudiante.calificacionFinal, this.oEstudiante.examenRecuperacion);
    this.oEstudiante.notaDefinitiva= Number(this.oEstudiante.notaDefinitiva.toFixed(2));
    if(this.oEstudiante.notaDefinitiva>=7){
      this.oEstudiante.estado=Estado.Aprobado;
    }else{
      this.oEstudiante.estado=Estado.Reprobado;
    }
  }


  closeModal() {
    this.close.emit();
  }

  onSubmit() {

    if(this.validaciones()){
      if (this.selectedEstudiante) {
        let modificar=this.listaEstudiantes.updateEstudiante(this.oEstudiante);
        if(modificar){
          this.listaEstudiantes.imprimirMensaje("Estudiante actualizado","El estudiante ha sido actualizado correctamente", "success");
        }
      } else {
        this.listaEstudiantes.addEstudiante(this.oEstudiante);
        this.listaEstudiantes.imprimirMensaje("Estudiante agregado","El estudiante ha sido agregado correctamente", "success");
      }
      this.closeModal();
    }
   
  }

  validaciones() {
    if (this.oEstudiante.codigo <= 0) {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "El código no puede ser menor a 0",
            "error"
        );
        return false;
    }

    if (this.listaEstudiantes.verificarCodigoRepetido(this.oEstudiante.codigo) && this.selectedEstudiante == null) {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "El código ya existe",
            "error"
        );
        return false;
    }

    if (this.oEstudiante.cedula == "") {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "La cédula no puede ser vacía",
            "error"
        );
        return false;
    }

    if (this.oEstudiante.nombres == "") {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "El nombre no puede ser vacío",
            "error"
        );
        return false;
    }

    if (this.oEstudiante.apellidos == "") {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "El apellido no puede ser vacío",
            "error"
        );
        return false;
    }

    if (typeof(this.oEstudiante.parcial1) != "number" || 
        this.oEstudiante.parcial1 < 0 || 
        this.oEstudiante.parcial1 > 10) {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "Ingrese un valor válido para el parcial 1 (entre 0 y 10)",
            "error"
        );
        return false;
    }

    if (typeof(this.oEstudiante.parcial2) != "number" || 
        this.oEstudiante.parcial2 < 0 || 
        this.oEstudiante.parcial2 > 10) {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "Ingrese un valor válido para el parcial 2 (entre 0 y 10)",
            "error"
        );
        return false;
    }

    if (this.oEstudiante.calificacionFinal >= 5.5 && 
        this.oEstudiante.calificacionFinal < 7 && 
        (typeof(this.oEstudiante.examenRecuperacion) != "number" || 
         this.oEstudiante.examenRecuperacion == null || 
         this.oEstudiante.examenRecuperacion < 0 || 
         this.oEstudiante.examenRecuperacion > 10)) {
        this.listaEstudiantes.imprimirMensaje(
            "Error de validación",
            "Ingrese una nota válida para el examen de recuperación (entre 0 y 10)",
            "error"
        );
        return false;
    }

    return true;
}
}
