import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Categorie } from '../../shared/categorie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-categories.component.html',
  styleUrl: './gestion-categories.component.css'
})
export class GestionCategoriesComponent implements OnInit {
  formValue !: FormGroup;
  categorieModelObj: Categorie = new Categorie();
  categorieData !: any;
  filteredCategorieData: any[] = [];
  searchTerm: string = '';
  showAddButton: boolean = true;
  showModal: boolean = false;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      nom: [''],
      description: ['']
    })
    this.getAllCategories();
  }

  postCategorieDetails() {
    this.categorieModelObj.nom = this.formValue.value.nom;
    this.categorieModelObj.description = this.formValue.value.description;
    this.categorieModelObj.id = this.categorieModelObj.id || this.generateId();
    
    this.api.postCategorie(this.categorieModelObj).subscribe(res => {
      alert("Catégorie ajoutée avec succès! ✅")
      this.formValue.reset();
      this.getAllCategories();
      this.showAddButton = true;
      this.showModal = false;
    }, err => {
      alert("Erreur lors de l'ajout");
    })
  }

  getAllCategories() {
    this.api.getAllCategories().subscribe(res => { 
      this.categorieData = res && res.length > 0 ? res.reverse() : [];
      this.filteredCategorieData = [...this.categorieData];
    })
  }

  deleteCategorie(row: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette catégorie? 🗑️')) {
      this.api.deleteCategorie(row.id)
        .subscribe(res => {
          alert("Catégorie supprimée ✓");
          this.getAllCategories();
        })
    }
  }

  onEdit(row: any) {
    this.showAddButton = false;
    this.showModal = true;
    this.categorieModelObj.id = row.id;
    this.formValue.controls['nom'].setValue(row.nom);
    this.formValue.controls['description'].setValue(row.description);
  }

  updateCategorieDetails() {
    this.categorieModelObj.nom = this.formValue.value.nom;
    this.categorieModelObj.description = this.formValue.value.description;
    
    this.api.updateCategorie(this.categorieModelObj, this.categorieModelObj.id)
      .subscribe(res => {
        alert("Catégorie modifiée avec succès! ✨");
        this.getAllCategories();
        this.showAddButton = true;
        this.formValue.reset();
        this.showModal = false;
      })
  }

  filterCategories() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategorieData = this.categorieData.filter((categorie: any) => {
      return (
        (categorie.nom && categorie.nom.toLowerCase().includes(term)) ||
        (categorie.description && categorie.description.toLowerCase().includes(term))
      );
    });
  }

  clickAddCategorie() {
    this.formValue.reset();
    this.showAddButton = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formValue.reset();
    this.showAddButton = true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
