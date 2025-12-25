import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Session } from '../../shared/session.model';
import { Formation } from '../../shared/formation.model';
import { Formateur } from '../../shared/formateur.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-sessions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-sessions.component.html',
  styleUrl: './gestion-sessions.component.css'
})
export class GestionSessionsComponent implements OnInit {
  formValue !: FormGroup;
  sessionModelObj: Session = new Session();
  sessionData !: any;
  formationData: Formation[] = [];
  formateurData: Formateur[] = [];
  filteredSessionData: any[] = [];
  searchTerm: string = '';
  showAddButton: boolean = true;
  showModal: boolean = false;
  selectedFormateurs: string[] = [];

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      formationId: [''],
      dateDebut: [''],
      dateFin: [''],
      description: ['']
    })
    this.getAllSessions();
    this.getAllFormations();
    this.getAllFormateurs();
  }

  postSessionDetails() {
    this.sessionModelObj.formationId = this.formValue.value.formationId;
    this.sessionModelObj.dateDebut = this.formValue.value.dateDebut;
    this.sessionModelObj.dateFin = this.formValue.value.dateFin;
    this.sessionModelObj.description = this.formValue.value.description;
    this.sessionModelObj.formateurIds = this.selectedFormateurs;
    this.sessionModelObj.candidatIds = [];
    this.sessionModelObj.id = this.sessionModelObj.id || this.generateId();
    
    this.api.postSession(this.sessionModelObj).subscribe(res => {
      alert("Session ajoutée avec succès! ✅")
      this.formValue.reset();
      this.selectedFormateurs = [];
      this.getAllSessions();
      this.showAddButton = true;
      this.showModal = false;
    }, err => {
      alert("Erreur lors de l'ajout");
    })
  }

  getAllSessions() {
    this.api.getAllSessions().subscribe(res => { 
      this.sessionData = res && res.length > 0 ? res.reverse() : [];
      this.filteredSessionData = [...this.sessionData];
    })
  }

  getAllFormations() {
    this.api.getAllFormations().subscribe(res => {
      this.formationData = res || [];
    })
  }

  getAllFormateurs() {
    this.api.getAllFormateurs().subscribe(res => {
      this.formateurData = res || [];
    })
  }

  toggleFormateur(formateurId: string) {
    const index = this.selectedFormateurs.indexOf(formateurId);
    if (index > -1) {
      this.selectedFormateurs.splice(index, 1);
    } else {
      if (this.selectedFormateurs.length < 2) {
        this.selectedFormateurs.push(formateurId);
      } else {
        alert("Maximum 2 formateurs par session");
      }
    }
  }

  getFormationName(formationId: string): string {
    const formation = this.formationData.find(f => f.id === formationId);
    return formation ? formation.titre : 'N/A';
  }

  getFormateurNames(formateurIds: string[]): string {
    if (!formateurIds || formateurIds.length === 0) return 'Aucun';
    return formateurIds.map(id => {
      const formateur = this.formateurData.find(f => f.id === id);
      return formateur ? `${formateur.prenom} ${formateur.nom}` : 'N/A';
    }).join(', ');
  }

  deleteSession(row: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette session? 🗑️')) {
      this.api.deleteSession(row.id)
        .subscribe(res => {
          alert("Session supprimée ✓");
          this.getAllSessions();
        })
    }
  }

  onEdit(row: any) {
    this.showAddButton = false;
    this.showModal = true;
    this.sessionModelObj.id = row.id;
    this.formValue.controls['formationId'].setValue(row.formationId);
    this.formValue.controls['dateDebut'].setValue(row.dateDebut);
    this.formValue.controls['dateFin'].setValue(row.dateFin);
    this.formValue.controls['description'].setValue(row.description);
    this.selectedFormateurs = row.formateurIds ? [...row.formateurIds] : [];
  }

  updateSessionDetails() {
    this.sessionModelObj.formationId = this.formValue.value.formationId;
    this.sessionModelObj.dateDebut = this.formValue.value.dateDebut;
    this.sessionModelObj.dateFin = this.formValue.value.dateFin;
    this.sessionModelObj.description = this.formValue.value.description;
    this.sessionModelObj.formateurIds = this.selectedFormateurs;
    
    this.api.updateSession(this.sessionModelObj, this.sessionModelObj.id)
      .subscribe(res => {
        alert("Session modifiée avec succès! ✨");
        this.getAllSessions();
        this.showAddButton = true;
        this.formValue.reset();
        this.selectedFormateurs = [];
        this.showModal = false;
      })
  }

  filterSessions() {
    const term = this.searchTerm.toLowerCase();
    this.filteredSessionData = this.sessionData.filter((session: any) => {
      const formationName = this.getFormationName(session.formationId).toLowerCase();
      return formationName.includes(term) || 
             (session.description && session.description.toLowerCase().includes(term));
    });
  }

  clickAddSession() {
    this.formValue.reset();
    this.selectedFormateurs = [];
    this.showAddButton = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formValue.reset();
    this.selectedFormateurs = [];
    this.showAddButton = true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
