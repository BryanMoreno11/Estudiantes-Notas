import { Routes } from '@angular/router';
import { ListarComponent } from './components/listar/listar.component';
export const routes: Routes = [
    { path: 'estudiantes', component: ListarComponent },
    { path: '**', redirectTo: 'estudiantes' }
];
