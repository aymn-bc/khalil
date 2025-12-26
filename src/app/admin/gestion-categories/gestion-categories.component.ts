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
  categoryForm!: FormGroup;
  categoryModel: Categorie = new Categorie();
  categoriesList: any;
  filteredCategories: any[] = [];
  searchQuery: string = '';
  isAddMode: boolean = true;
  isModalVisible: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      nom: [''],
      description: ['']
    });
    this.loadAllCategories();
  }

  createCategory(): void {
    this.categoryModel.nom = this.categoryForm.value.nom;
    this.categoryModel.description = this.categoryForm.value.description;
    this.categoryModel.id = this.categoryModel.id || this.createUniqueId();
    
    this.apiService.postCategorie(this.categoryModel).subscribe({
      next: (res) => {
        alert("Catégorie ajoutée avec succès!");
        this.categoryForm.reset();
        this.loadAllCategories();
        this.isAddMode = true;
        this.isModalVisible = false;
      },
      error: (err) => {
        alert("Erreur lors de l'ajout");
      }
    });
  }

  loadAllCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (res) => { 
        this.categoriesList = res && res.length > 0 ? res.reverse() : [];
        this.filteredCategories = [...this.categoriesList];
      }
    });
  }

  removeCategory(category: any): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
      this.apiService.deleteCategorie(category.id)
        .subscribe({
          next: (res) => {
            alert("Catégorie supprimée");
            this.loadAllCategories();
          }
        });
    }
  }

  editCategory(category: any): void {
    this.isAddMode = false;
    this.isModalVisible = true;
    this.categoryModel.id = category.id;
    this.categoryForm.controls['nom'].setValue(category.nom);
    this.categoryForm.controls['description'].setValue(category.description);
  }

  updateCategory(): void {
    this.categoryModel.nom = this.categoryForm.value.nom;
    this.categoryModel.description = this.categoryForm.value.description;
    
    this.apiService.updateCategorie(this.categoryModel, this.categoryModel.id)
      .subscribe({
        next: (res) => {
          alert("Catégorie modifiée avec succès!");
          this.loadAllCategories();
          this.isAddMode = true;
          this.categoryForm.reset();
          this.isModalVisible = false;
        }
      });
  }

  filterCategories(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categoriesList.filter((cat: any) => {
      return (
        (cat.nom && cat.nom.toLowerCase().includes(query)) ||
        (cat.description && cat.description.toLowerCase().includes(query))
      );
    });
  }

  openAddModal(): void {
    this.categoryForm.reset();
    this.isAddMode = true;
    this.isModalVisible = true;
  }

  hideModal(): void {
    this.isModalVisible = false;
    this.categoryForm.reset();
    this.isAddMode = true;
  }

  private createUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
