// Logique métier du signalement d'incident (itération 2). Pas de backend : persistance en localStorage, par équipement.
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

export function ajouterIncident(equipementId: string, saisie: SaisieIncident, auteur: string, enLigne: boolean): Incident {
  const incident: Incident = {
    id: `INC-${Date.now()}`,
    equipementId,
    type: saisie.type,
    categorie: saisie.categorie,
    constat: saisie.constat,
    photo: saisie.photo,
    urgence: saisie.urgence as Urgence,
    auteur,
    date: new Date().toISOString(),
    statut: enLigne ? "nouveau" : "en_attente",
  };
  const incidents = [incident, ...chargerIncidents(equipementId)];
  window.localStorage.setItem(cle(equipementId), JSON.stringify(incidents));
  return incident;
}

export function renvoyerEnAttente(equipementId: string): Incident[] {
  const incidents = chargerIncidents(equipementId).map((i) => (i.statut === "en_attente" ? { ...i, statut: "nouveau" as const } : i));
  window.localStorage.setItem(cle(equipementId), JSON.stringify(incidents));
  return incidents;
}
