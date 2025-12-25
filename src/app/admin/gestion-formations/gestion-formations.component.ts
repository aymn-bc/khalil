import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Formation } from '../../shared/formation.model';
import { Categorie } from '../../shared/categorie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-formations',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-formations.component.html',
  styleUrl: './gestion-formations.component.css'
})
export class GestionFormationsComponent implements OnInit {
  formValue !: FormGroup;
  formationModelObj: Formation = new Formation();
  formationData !: any;
  categorieData: Categorie[] = [];
  filteredFormationData: any[] = [];
  searchTerm: string = '';
  showAddButton: boolean = true;
  showModal: boolean = false;
  tagsInput: string = '';
  selectedCategories: string[] = [];

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      titre: [''],
      description: [''],
      chargeHoraire: [0],
      programme: [''],
      niveauDifficulte: ['débutant'],
      tags: [''],
      categories: ['']
    })
    this.getAllFormations();
    this.getAllCategories();
  }

  postFormationDetails() {
    this.formationModelObj.titre = this.formValue.value.titre;
    this.formationModelObj.description = this.formValue.value.description;
    this.formationModelObj.chargeHoraire = this.formValue.value.chargeHoraire;
    this.formationModelObj.programme = this.formValue.value.programme;
    this.formationModelObj.niveauDifficulte = this.formValue.value.niveauDifficulte;
    this.formationModelObj.tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t);
    this.formationModelObj.categories = this.selectedCategories;
    this.formationModelObj.id = this.formationModelObj.id || this.generateId();
    
    this.api.postFormation(this.formationModelObj).subscribe(res => {
      alert("Formation ajoutée avec succès! ✅")
      this.formValue.reset();
      this.tagsInput = '';
      this.selectedCategories = [];
      this.getAllFormations();
      this.showAddButton = true;
      this.showModal = false;
    }, err => {
      alert("Erreur lors de l'ajout");
    })
  }

  getAllFormations() {
    this.api.getAllFormations().subscribe(res => { 
      this.formationData = res && res.length > 0 ? res.reverse() : [];
      this.filteredFormationData = [...this.formationData];
    })
  }

  getAllCategories() {
    this.api.getAllCategories().subscribe(res => {
      this.categorieData = res || [];
    })
  }

  toggleCategory(categoryId: string) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
  }

  deleteFormation(row: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette formation? 🗑️')) {
      this.api.deleteFormation(row.id)
        .subscribe(res => {
          alert("Formation supprimée ✓");
          this.getAllFormations();
        })
    }
  }

  onEdit(row: any) {
    this.showAddButton = false;
    this.showModal = true;
    this.formationModelObj.id = row.id;
    this.formValue.controls['titre'].setValue(row.titre);
    this.formValue.controls['description'].setValue(row.description);
    this.formValue.controls['chargeHoraire'].setValue(row.chargeHoraire);
    this.formValue.controls['programme'].setValue(row.programme);
    this.formValue.controls['niveauDifficulte'].setValue(row.niveauDifficulte);
    this.tagsInput = row.tags ? row.tags.join(', ') : '';
    this.selectedCategories = row.categories ? [...row.categories] : [];
  }

  updateFormationDetails() {
    this.formationModelObj.titre = this.formValue.value.titre;
    this.formationModelObj.description = this.formValue.value.description;
    this.formationModelObj.chargeHoraire = this.formValue.value.chargeHoraire;
    this.formationModelObj.programme = this.formValue.value.programme;
    this.formationModelObj.niveauDifficulte = this.formValue.value.niveauDifficulte;
    this.formationModelObj.tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t);
    this.formationModelObj.categories = this.selectedCategories;
    
    this.api.updateFormation(this.formationModelObj, this.formationModelObj.id)
      .subscribe(res => {
        alert("Formation modifiée avec succès! ✨");
        this.getAllFormations();
        this.showAddButton = true;
        this.formValue.reset();
        this.tagsInput = '';
        this.selectedCategories = [];
        this.showModal = false;
      })
  }

  filterFormations() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFormationData = this.formationData.filter((formation: any) => {
      return (
        (formation.titre && formation.titre.toLowerCase().includes(term)) ||
        (formation.description && formation.description.toLowerCase().includes(term))
      );
    });
  }

  clickAddFormation() {
    this.formValue.reset();
    this.tagsInput = '';
    this.selectedCategories = [];
    this.showAddButton = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formValue.reset();
    this.tagsInput = '';
    this.selectedCategories = [];
    this.showAddButton = true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
