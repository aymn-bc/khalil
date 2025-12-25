import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Categorie } from '../shared/categorie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Categorie[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.api.getAllCategories().subscribe(res => {
      this.categories = res || [];
    });
  }
}

