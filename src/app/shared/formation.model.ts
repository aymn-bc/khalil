export class Formation {
  id: string = '';
  titre: string = '';
  description: string = '';
  chargeHoraire: number = 0; // nombre d'heures
  programme: string = ''; // URL to PDF
  niveauDifficulte: 'débutant' | 'intermédiaire' | 'avancé' = 'débutant';
  tags: string[] = [];
  categories: string[] = [];
}

