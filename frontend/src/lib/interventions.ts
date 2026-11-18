// Enregistrement d'une intervention de réparation (itération 5). Persistance en localStorage, par équipement.
import type { Equipement } from "./equipements";

export type Intervention = {
  id: string;
  equipementId: string;
  incidentId: string;
  prestataire: string;
  date: string;
  priseEnCharge: string;
  photoReparation: string;
};

export type SaisieIntervention = {
  prestataire: string;
  date: string;
  priseEnCharge: string;
  photoReparation: string;
};

const CHAMPS_OBLIGATOIRES: { cle: keyof SaisieIntervention; libelle: string }[] = [
  { cle: "prestataire", libelle: "le prestataire" },
  { cle: "date", libelle: "la date" },
  { cle: "priseEnCharge", libelle: "la prise en charge" },
  { cle: "photoReparation", libelle: "la photo de la réparation" },
];

export function champsManquantsIntervention(saisie: SaisieIntervention): string[] {
  return CHAMPS_OBLIGATOIRES.filter(({ cle }) => !saisie[cle]).map(({ libelle }) => libelle);
}

// Simplifié par rapport à la spec (Campus → Association ; Convention ou Terrain de la ville → Ville ; Sans convention → À arbitrer) :
// notre modèle n'a pas de terrain « sans convention », donc seuls les deux premiers cas existent.
export function priseEnChargeProposee(equipement: Equipement): "Ville" | "Association" {
  return equipement.proprietaire === "prive" ? "Association" : "Ville";
}

function cle(equipementId: string): string {
  return `interventions-${equipementId}`;
}

export function chargerInterventions(equipementId: string): Intervention[] {
  if (typeof window === "undefined") return [];
  const brut = window.localStorage.getItem(cle(equipementId));
  return brut ? (JSON.parse(brut) as Intervention[]) : [];
}

export function ajouterIntervention(equipement: Equipement, incidentId: string, saisie: SaisieIntervention): Intervention {
  const intervention: Intervention = {
    id: `IVT-${Date.now()}`,
    equipementId: equipement.id,
    incidentId,
    ...saisie,
  };
  const interventions = [intervention, ...chargerInterventions(equipement.id)];
  window.localStorage.setItem(cle(equipement.id), JSON.stringify(interventions));
  return intervention;
}
