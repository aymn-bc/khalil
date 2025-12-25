import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Formateur } from './formateur.model';
import { Formation } from './formation.model';
import { Candidat } from './candidat.model';
import { Session } from './session.model';
import { Categorie } from './categorie.model';
import { Inscription } from './inscription.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Changez cette URL selon votre backend

  constructor(private http: HttpClient) { }

  // Formateurs
  postFormateur(data: Formateur): Observable<Formateur> {
    return this.http.post<Formateur>(`${this.apiUrl}/formateurs`, data).pipe(
      map((res: Formateur) => res)
    );
  }

  getAllFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`${this.apiUrl}/formateurs`).pipe(
      map(res => res as Formateur[])
    );
  }

  getFormateur(id: string): Observable<Formateur> {
    return this.http.get<Formateur>(`${this.apiUrl}/formateurs/${id}`).pipe(
      map((res: Formateur) => res)
    );
  }

  deleteFormateur(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/formateurs/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateFormateur(data: Formateur, id: string): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.apiUrl}/formateurs/${id}`, data).pipe(
      map((res: Formateur) => res)
    );
  }

  // Formations
  postFormation(data: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/formations`, data).pipe(
      map((res: Formation) => res)
    );
  }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`).pipe(
      map(res => res as Formation[])
    );
  }

  getFormation(id: string): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/formations/${id}`).pipe(
      map((res: Formation) => res)
    );
  }

  deleteFormation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/formations/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateFormation(data: Formation, id: string): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/formations/${id}`, data).pipe(
      map((res: Formation) => res)
    );
  }

  // Candidats
  postCandidat(data: Candidat): Observable<Candidat> {
    return this.http.post<Candidat>(`${this.apiUrl}/candidats`, data).pipe(
      map((res: Candidat) => res)
    );
  }

  getAllCandidats(): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`${this.apiUrl}/candidats`).pipe(
      map(res => res as Candidat[])
    );
  }

  getCandidat(id: string): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.apiUrl}/candidats/${id}`).pipe(
      map((res: Candidat) => res)
    );
  }

  deleteCandidat(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/candidats/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateCandidat(data: Candidat, id: string): Observable<Candidat> {
    return this.http.put<Candidat>(`${this.apiUrl}/candidats/${id}`, data).pipe(
      map((res: Candidat) => res)
    );
  }

  // Sessions
  postSession(data: Session): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions`, data).pipe(
      map((res: Session) => res)
    );
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions`).pipe(
      map(res => res as Session[])
    );
  }

  getSession(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/${id}`).pipe(
      map((res: Session) => res)
    );
  }

  getSessionsByFormation(formationId: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions?formationId=${formationId}`).pipe(
      map(res => res as Session[])
    );
  }

  deleteSession(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sessions/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateSession(data: Session, id: string): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/sessions/${id}`, data).pipe(
      map((res: Session) => res)
    );
  }

  // Categories
  postCategorie(data: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/categories`, data).pipe(
      map((res: Categorie) => res)
    );
  }

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`).pipe(
      map(res => res as Categorie[])
    );
  }

  getCategorie(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/categories/${id}`).pipe(
      map((res: Categorie) => res)
    );
  }

  deleteCategorie(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateCategorie(data: Categorie, id: string): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/categories/${id}`, data).pipe(
      map((res: Categorie) => res)
    );
  }

  // Inscriptions
  postInscription(data: Inscription): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.apiUrl}/inscriptions`, data).pipe(
      map((res: Inscription) => res)
    );
  }

  getInscriptionsBySession(sessionId: string): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/inscriptions?sessionId=${sessionId}`).pipe(
      map(res => res as Inscription[])
    );
  }
}

