export const KyuEntries = [
  "Blanche",
  "Demi-jaune",
  "Jaune",
  "Demi-orange",
  "Orange",
  "Demi-verte",
  "Verte",
  "Demi-bleue",
  "Bleue",
  "Marron",
]

export type KyuName = typeof KyuEntries[number];

export const CoursEntries = [
  "S 10:00",
  "S 11:00",
  "L 17:00",
  "M 16:00",
  "M 17:00",
]

export type CoursName = typeof CoursEntries[number];

export interface Cours {
  id: number;
  nom: CoursName;
}

export interface Coach {
  id: string;
  prenom: string;
}
export interface Kyu {
  id: number;
  date: string;
}
export interface Eleve {
  id: string;
  number?: string;
  nom?: string;
  prenom: string;
  coursId?: number;
  kyus?: Kyu[];
}

