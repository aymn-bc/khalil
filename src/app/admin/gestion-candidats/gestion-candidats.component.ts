import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Candidat } from '../../shared/candidat.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-candidats',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './gestion-candidats.component.html',
  styleUrl: './gestion-candidats.component.css'
})
export class GestionCandidatsComponent implements OnInit {
  formValue !: FormGroup;
  candidatModelObj: Candidat = new Candidat();
  candidatData !: any;
  currentMaxId: number = 0;
  filteredCandidatData: any[] = [];
  searchTerm: string = '';
  showAddButton: boolean = true;
  showModal: boolean = false;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      nom: [''],
      prenom: [''],
      email: [''],
      numeroCarteIdentite: [''],
      photo: [''],
      motDePasse: ['']
    })
    this.getAllCandidats();
  }

  postCandidatDetails() {
    this.candidatModelObj.nom = this.formValue.value.nom;
    this.candidatModelObj.prenom = this.formValue.value.prenom;
    this.candidatModelObj.email = this.formValue.value.email;
    this.candidatModelObj.numeroCarteIdentite = this.formValue.value.numeroCarteIdentite;
    this.candidatModelObj.photo = this.formValue.value.photo;
    this.candidatModelObj.motDePasse = this.formValue.value.motDePasse;
    
    this.candidatModelObj.id = (++this.currentMaxId).toString();
    
    this.api.postCandidat(this.candidatModelObj).subscribe(res => {
      alert("Candidat ajouté avec succès! ✅")
      this.formValue.reset();
      this.getAllCandidats();
      this.showAddButton = true;
      this.showModal = false;
    }, err => {
      alert("Erreur lors de l'ajout");
    })
  }

  getAllCandidats() {
    this.api.getAllCandidats().subscribe(res => { 
      this.candidatData = res && res.length > 0 ? res.reverse() : [];
      this.filteredCandidatData = [...this.candidatData];
      if(this.candidatData.length > 0) {
        this.currentMaxId = Math.max(...this.candidatData.map((c: any) => parseInt(c.id) || 0));
      } else {
        this.currentMaxId = 0;
      }
    })
  }

  deleteCandidat(row: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce candidat? 🗑️')) {
      this.api.deleteCandidat(row.id)
        .subscribe(res => {
          alert("Candidat supprimé ✓");
          this.getAllCandidats();
        })
    }
  }

  onEdit(row: any) {
    this.showAddButton = false;
    this.showModal = true;
    this.candidatModelObj.id = row.id;
    this.formValue.controls['nom'].setValue(row.nom);
    this.formValue.controls['prenom'].setValue(row.prenom);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['numeroCarteIdentite'].setValue(row.numeroCarteIdentite);
    this.formValue.controls['photo'].setValue(row.photo);
    this.formValue.controls['motDePasse'].setValue(row.motDePasse);
  }

  updateCandidatDetails() {
    this.candidatModelObj.nom = this.formValue.value.nom;
    this.candidatModelObj.prenom = this.formValue.value.prenom;
    this.candidatModelObj.email = this.formValue.value.email;
    this.candidatModelObj.numeroCarteIdentite = this.formValue.value.numeroCarteIdentite;
    this.candidatModelObj.photo = this.formValue.value.photo;
    this.candidatModelObj.motDePasse = this.formValue.value.motDePasse;
    
    this.api.updateCandidat(this.candidatModelObj, this.candidatModelObj.id)
      .subscribe(res => {
        alert("Candidat modifié avec succès! ✨");
        this.getAllCandidats();
        this.showAddButton = true;
        this.formValue.reset();
        this.showModal = false;
      })
  }

  filterCandidats() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCandidatData = this.candidatData.filter((candidat: any) => {
      return (
        (candidat.nom && candidat.nom.toLowerCase().includes(term)) ||
        (candidat.prenom && candidat.prenom.toLowerCase().includes(term)) ||
        (candidat.email && candidat.email.toLowerCase().includes(term))
      );
    });
  }

  clickAddCandidat() {
    this.formValue.reset();
    this.showAddButton = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formValue.reset();
    this.showAddButton = true;
  }
}

