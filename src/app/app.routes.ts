import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RechercheFormationsComponent } from './recherche-formations/recherche-formations.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { GestionCandidatsComponent } from './admin/gestion-candidats/gestion-candidats.component';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'formations', component: RechercheFormationsComponent },
  { path: 'formation/:id', component: FormationDetailsComponent },
  
  // Admin routes
  {
    path: 'admin-space',
    component: AdminLayoutComponent,
    children: [
      { path: 'candidats', component: GestionCandidatsComponent },
      { path: '', redirectTo: 'candidats', pathMatch: 'full' }
    ]
  }
];
