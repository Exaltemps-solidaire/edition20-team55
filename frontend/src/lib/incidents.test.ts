import { describe, expect, it } from "vitest";
import { aUnIncidentDanger, champsManquants, type Incident } from "./incidents";

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
