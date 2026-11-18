// Vocabulaire et villes repris du prototype (cadrage/4-prototype.md) : noms de villes et de terrains publics.
export type EtatEquipement = "ok" | "grey";

export type Equipement = {
  id: string;
  terrain: string;
  ville: string;
  type: string;
  etat: EtatEquipement;
};

export const EQUIPEMENTS: Equipement[] = [
  { id: "EQ-LYO1-BF1", terrain: "Terrain Lyon 1", ville: "Lyon", type: "But de football", etat: "ok" },
  { id: "EQ-LYO1-PB1", terrain: "Terrain Lyon 1", ville: "Lyon", type: "Panier de basket", etat: "ok" },
  { id: "EQ-VIL1-CM1", terrain: "Terrain Villeurbanne", ville: "Villeurbanne", type: "Cage multisport", etat: "ok" },
  { id: "EQ-ROX1-PB1", terrain: "Terrain Ris-Orangis", ville: "Ris-Orangis", type: "Panier de basket", etat: "grey" },
  { id: "EQ-SAE1-FP1", terrain: "Terrain Saint-Étienne", ville: "Saint-Étienne", type: "Filet pare-ballons", etat: "grey" },
];

export const ETATS: Record<EtatEquipement, { libelle: string; classe: string }> = {
  ok: { libelle: "Vérifié, RAS", classe: "s-ok" },
  grey: { libelle: "Pas d'info récente", classe: "s-grey" },
};
