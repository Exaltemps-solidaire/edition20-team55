// Logique métier du signalement d'incident (itération 2). Pas de backend : persistance en localStorage, par équipement.
import { attribuer, type CodeRegle } from "./regles";
import { EQUIPEMENTS, type Equipement } from "./equipements";

export type Urgence = "normale" | "forte" | "danger";

export type Incident = {
  id: string;
  equipementId: string;
  type: string;
  categorie: string;
  constat: string;
  photo: string;
  urgence: Urgence;
  auteur: string;
  date: string;
  statut: "nouveau" | "en_attente";
  attribueA: string;
  regleAppliquee: CodeRegle;
  prisEnCharge: boolean;
};

export type SaisieIncident = {
  type: string;
  categorie: string;
  constat: string;
  photo: string;
  urgence: Urgence | "";
};

const CHAMPS_OBLIGATOIRES: { cle: keyof SaisieIncident; libelle: string }[] = [
  { cle: "type", libelle: "le type" },
  { cle: "categorie", libelle: "la catégorie" },
  { cle: "constat", libelle: "le constat" },
  { cle: "photo", libelle: "une photo" },
  { cle: "urgence", libelle: "le niveau d'urgence" },
];

export function champsManquants(saisie: SaisieIncident): string[] {
  return CHAMPS_OBLIGATOIRES.filter(({ cle }) => !saisie[cle]).map(({ libelle }) => libelle);
}

export function aUnIncidentDanger(incidents: Incident[]): boolean {
  return incidents.some((i) => i.urgence === "danger");
}

function cle(equipementId: string): string {
  return `incidents-${equipementId}`;
}

export function chargerIncidents(equipementId: string): Incident[] {
  if (typeof window === "undefined") return [];
  const brut = window.localStorage.getItem(cle(equipementId));
  return brut ? (JSON.parse(brut) as Incident[]) : [];
}

export function ajouterIncident(equipement: Equipement, saisie: SaisieIncident, auteur: string, enLigne: boolean): Incident {
  const { attribueA, regleAppliquee } = attribuer({ categorie: saisie.categorie, urgence: saisie.urgence as Urgence }, equipement);
  const incident: Incident = {
    id: `INC-${Date.now()}`,
    equipementId: equipement.id,
    type: saisie.type,
    categorie: saisie.categorie,
    constat: saisie.constat,
    photo: saisie.photo,
    urgence: saisie.urgence as Urgence,
    auteur,
    date: new Date().toISOString(),
    statut: enLigne ? "nouveau" : "en_attente",
    attribueA,
    regleAppliquee,
    prisEnCharge: false,
  };
  const incidents = [incident, ...chargerIncidents(equipement.id)];
  window.localStorage.setItem(cle(equipement.id), JSON.stringify(incidents));
  return incident;
}

export function prendreEnCharge(equipementId: string, incidentId: string): Incident[] {
  const incidents = chargerIncidents(equipementId).map((i) => (i.id === incidentId ? { ...i, prisEnCharge: true } : i));
  window.localStorage.setItem(cle(equipementId), JSON.stringify(incidents));
  return incidents;
}

export function renvoyerEnAttente(equipementId: string): Incident[] {
  const incidents = chargerIncidents(equipementId).map((i) => (i.statut === "en_attente" ? { ...i, statut: "nouveau" as const } : i));
  window.localStorage.setItem(cle(equipementId), JSON.stringify(incidents));
  return incidents;
}

// Vue agrégée tous équipements confondus, pour les bannettes de l'itération 4.
export function chargerTousIncidents(): Incident[] {
  return EQUIPEMENTS.flatMap((e) => chargerIncidents(e.id));
}

const GRAVITE: Record<Urgence, number> = { danger: 0, forte: 1, normale: 2 };

// Tri de la bannette : Danger en tête, puis du plus récent au plus ancien.
export function trierParGraviteEtDate(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    const parGravite = GRAVITE[a.urgence] - GRAVITE[b.urgence];
    if (parGravite !== 0) return parGravite;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function renvoyerTousEnAttente(): void {
  for (const e of EQUIPEMENTS) renvoyerEnAttente(e.id);
}
