export const KyuEntries = [
  "Blanche",      // 0
  "Demi-jaune",   // 1
  "Jaune",        // 2
  "Demi-orange",  // 3
  "Orange",       // 4
  "Demi-verte",   // 5
  "Verte",        // 6
  "Demi-bleue",   // 7
  "Bleue",        // 8
  "Marron",       // 9
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

