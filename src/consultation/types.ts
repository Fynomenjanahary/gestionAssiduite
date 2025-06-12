// types.ts
export interface Student {
    lastActivity: string | number | Date;
    id: number;
    nom: string;
    prenom: string;
    niveau: string;
    points: number;
    status: string;
  }

  export interface Reason {
    id: number;
    label: string;
    type: string;
    points: number;
  }
  