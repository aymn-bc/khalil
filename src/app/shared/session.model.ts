export class Session {
  id: string = '';
  formationId: string = '';
  formateurIds: string[] = []; // 1 ou 2 formateurs
  candidatIds: string[] = []; // liste des candidats inscrits
  dateDebut: string = ''; // ISO date string
  dateFin: string = ''; // ISO date string
  description: string = '';
}

