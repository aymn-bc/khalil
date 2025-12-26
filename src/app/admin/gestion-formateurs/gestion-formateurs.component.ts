import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Formateur } from '../../shared/formateur.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-formateurs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-formateurs.component.html',
  styleUrl: './gestion-formateurs.component.css'
})
export class GestionFormateursComponent implements OnInit {
  formateurForm!: FormGroup;
  formateurModel: Formateur = new Formateur();
  formateursList: any;
  filteredFormateurs: any[] = [];
  searchQuery: string = '';
  isAddMode: boolean = true;
  isModalVisible: boolean = false;
  specialitesInput: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.formateurForm = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''],
      telephone: [''],
      numeroCarteIdentite: [''],
      photo: [''],
      cv: [''],
      specialites: ['']
    });
    this.loadAllFormateurs();
  }

  createFormateur(): void {
    this.formateurModel.nom = this.formateurForm.value.nom;
    this.formateurModel.prenom = this.formateurForm.value.prenom;
    this.formateurModel.email = this.formateurForm.value.email;
    this.formateurModel.telephone = this.formateurForm.value.telephone;
    this.formateurModel.numeroCarteIdentite = this.formateurForm.value.numeroCarteIdentite;
    this.formateurModel.photo = this.formateurForm.value.photo;
    this.formateurModel.cv = this.formateurForm.value.cv;
    this.formateurModel.specialites = this.specialitesInput.split(',').map(s => s.trim()).filter(s => s);
    
    this.formateurModel.id = this.formateurModel.id || this.createUniqueId();
    
    this.apiService.postFormateur(this.formateurModel).subscribe({
      next: (res) => {
        alert("Formateur ajouté avec succès!");
        this.formateurForm.reset();
        this.specialitesInput = '';
        this.loadAllFormateurs();
        this.isAddMode = true;
        this.isModalVisible = false;
      },
      error: (err) => {
        alert("Erreur lors de l'ajout");
      }
    });
  }

  loadAllFormateurs(): void {
    this.apiService.getAllFormateurs().subscribe({
      next: (res) => { 
        this.formateursList = res && res.length > 0 ? res.reverse() : [];
        this.filteredFormateurs = [...this.formateursList];
      }
    });
  }

  removeFormateur(formateur: any): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce formateur?')) {
      this.apiService.deleteFormateur(formateur.id)
        .subscribe({
          next: (res) => {
            alert("Formateur supprimé");
            this.loadAllFormateurs();
          }
        });
    }
  }

  editFormateur(formateur: any): void {
    this.isAddMode = false;
    this.isModalVisible = true;
    this.formateurModel.id = formateur.id;
    this.formateurForm.controls['nom'].setValue(formateur.nom);
    this.formateurForm.controls['prenom'].setValue(formateur.prenom);
    this.formateurForm.controls['email'].setValue(formateur.email);
    this.formateurForm.controls['telephone'].setValue(formateur.telephone);
    this.formateurForm.controls['numeroCarteIdentite'].setValue(formateur.numeroCarteIdentite);
    this.formateurForm.controls['photo'].setValue(formateur.photo);
    this.formateurForm.controls['cv'].setValue(formateur.cv);
    this.specialitesInput = formateur.specialites ? formateur.specialites.join(', ') : '';
  }

  updateFormateur(): void {
    this.formateurModel.nom = this.formateurForm.value.nom;
    this.formateurModel.prenom = this.formateurForm.value.prenom;
    this.formateurModel.email = this.formateurForm.value.email;
    this.formateurModel.telephone = this.formateurForm.value.telephone;
    this.formateurModel.numeroCarteIdentite = this.formateurForm.value.numeroCarteIdentite;
    this.formateurModel.photo = this.formateurForm.value.photo;
    this.formateurModel.cv = this.formateurForm.value.cv;
    this.formateurModel.specialites = this.specialitesInput.split(',').map(s => s.trim()).filter(s => s);
    
    this.apiService.updateFormateur(this.formateurModel, this.formateurModel.id)
      .subscribe({
        next: (res) => {
          alert("Formateur modifié avec succès!");
          this.loadAllFormateurs();
          this.isAddMode = true;
          this.formateurForm.reset();
          this.specialitesInput = '';
          this.isModalVisible = false;
        }
      });
  }

  filterFormateurs(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredFormateurs = this.formateursList.filter((formateur: any) => {
      return (
        (formateur.nom && formateur.nom.toLowerCase().includes(query)) ||
        (formateur.prenom && formateur.prenom.toLowerCase().includes(query)) ||
        (formateur.email && formateur.email.toLowerCase().includes(query))
      );
    });
  }

  openAddModal(): void {
    this.formateurForm.reset();
    this.specialitesInput = '';
    this.isAddMode = true;
    this.isModalVisible = true;
  }

  hideModal(): void {
    this.isModalVisible = false;
    this.formateurForm.reset();
    this.specialitesInput = '';
    this.isAddMode = true;
  }

  private createUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}



