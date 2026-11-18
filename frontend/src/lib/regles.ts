// Règles d'attribution des incidents à réception (R1 à R4, build-spec.md §E6/§9.1).
// La première règle vraie s'applique ; l'ordre ci-dessous est donc significatif.
import type { Equipement } from "./equipements";
import { PERSONAS } from "./personas";
import type { Urgence } from "./incidents";

export type CodeRegle = "R1" | "R2" | "R3" | "R4";

export type Attribution = {
  attribueA: string;
  regleAppliquee: CodeRegle;
};

const CATEGORIES_STRUCTURE = ["structure", "fixation"];

function idPersonaDuRole(role: "directeur" | "ppub" | "rst"): string {
  const persona = PERSONAS.find((p) => p.role === role);
  if (!persona) throw new Error(`Aucun persona pour le rôle ${role}`);
  return persona.id;
}

export function attribuer(saisie: { categorie: string; urgence: Urgence }, equipement: Equipement): Attribution {
  if (saisie.urgence === "danger") {
    return { attribueA: idPersonaDuRole("directeur"), regleAppliquee: "R1" };
  }
  if (CATEGORIES_STRUCTURE.includes(saisie.categorie.trim().toLowerCase())) {
    return { attribueA: idPersonaDuRole("directeur"), regleAppliquee: "R2" };
  }
  if (equipement.proprietaire === "ville" || equipement.proprietaire === "convention") {
    return { attribueA: idPersonaDuRole("ppub"), regleAppliquee: "R3" };
  }
  return { attribueA: idPersonaDuRole("rst"), regleAppliquee: "R4" };
}
