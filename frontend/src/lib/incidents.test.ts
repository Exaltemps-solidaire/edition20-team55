import { beforeEach, describe, expect, it } from "vitest";
import {
  ajouterIncident,
  aUnIncidentDanger,
  champsManquants,
  chargerIncidents,
  renvoyerEnAttente,
  trierParGraviteEtDate,
  type Incident,
} from "./incidents";
import type { Equipement } from "./equipements";

describe("champsManquants", () => {
  it("liste les champs obligatoires absents", () => {
    const manquants = champsManquants({ type: "Filet déchiré", categorie: "", constat: "", photo: "", urgence: "" });
    expect(manquants).toEqual(["la catégorie", "le constat", "une photo", "le niveau d'urgence"]);
  });

  it("ne signale rien quand tous les champs sont remplis", () => {
    const manquants = champsManquants({
      type: "Filet déchiré",
      categorie: "Usure",
      constat: "Trou visible",
      photo: "photo.jpg",
      urgence: "normale",
    });
    expect(manquants).toEqual([]);
  });
});

describe("aUnIncidentDanger", () => {
  const base: Omit<Incident, "urgence" | "statut"> = {
    id: "INC-1",
    equipementId: "EQ-1",
    type: "Filet déchiré",
    categorie: "Usure",
    constat: "Trou visible",
    photo: "photo.jpg",
    auteur: "RST",
    date: new Date().toISOString(),
    attribueA: "rst-amara",
    regleAppliquee: "R4",
    prisEnCharge: false,
  };

  it("renvoie vrai si un incident nouveau est en urgence danger", () => {
    const incidents: Incident[] = [{ ...base, urgence: "danger", statut: "nouveau" }];
    expect(aUnIncidentDanger(incidents)).toBe(true);
  });

  it("renvoie faux si aucun incident n'est en urgence danger", () => {
    const incidents: Incident[] = [{ ...base, urgence: "forte", statut: "nouveau" }];
    expect(aUnIncidentDanger(incidents)).toBe(false);
  });
});

describe("file d'attente hors ligne", () => {
  const equipementId = "EQ-TEST";
  const equipement: Equipement = { id: equipementId, terrain: "Terrain Test", ville: "Test", type: "But de football", etat: "ok", proprietaire: "prive" };
  const saisie = { type: "Filet déchiré", categorie: "Usure", constat: "Trou visible", photo: "photo.jpg", urgence: "forte" as const };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("met l'incident en attente quand il est créé hors ligne", () => {
    ajouterIncident(equipement, saisie, "RST", false);
    expect(chargerIncidents(equipementId)[0].statut).toBe("en_attente");
  });

  it("passe tous les incidents en attente à « nouveau » au retour du réseau, sans perte", () => {
    ajouterIncident(equipement, saisie, "RST", false);
    ajouterIncident(equipement, saisie, "RST", false);
    const incidents = renvoyerEnAttente(equipementId);
    expect(incidents).toHaveLength(2);
    expect(incidents.every((i) => i.statut === "nouveau")).toBe(true);
  });
});

describe("trierParGraviteEtDate", () => {
  const base: Omit<Incident, "urgence" | "statut" | "date"> = {
    id: "INC-1",
    equipementId: "EQ-1",
    type: "Filet déchiré",
    categorie: "Usure",
    constat: "Trou visible",
    photo: "photo.jpg",
    auteur: "RST",
    attribueA: "rst-amara",
    regleAppliquee: "R4",
    prisEnCharge: false,
  };

  it("place les incidents Danger en tête, puis du plus récent au plus ancien", () => {
    const incidents: Incident[] = [
      { ...base, id: "a", urgence: "normale", statut: "nouveau", date: "2026-01-01T10:00:00.000Z" },
      { ...base, id: "b", urgence: "danger", statut: "nouveau", date: "2026-01-01T09:00:00.000Z" },
      { ...base, id: "c", urgence: "forte", statut: "nouveau", date: "2026-01-01T11:00:00.000Z" },
    ];
    const tries = trierParGraviteEtDate(incidents);
    expect(tries.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });
});
