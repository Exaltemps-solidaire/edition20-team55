"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnTete } from "@/components/EnTete";
import { trouverPersona, type Persona } from "@/lib/personas";
import { EQUIPEMENTS, ETATS } from "@/lib/equipements";
import { ajouterIncident, aUnIncidentDanger, champsManquants, chargerIncidents, type Incident, type Urgence } from "@/lib/incidents";
import styles from "./page.module.css";

function personaInitial(): Persona | null {
  if (typeof window === "undefined") return null;
  return trouverPersona(window.localStorage.getItem("persona-id"));
}

const LIBELLES_URGENCE: Record<Urgence, string> = {
  normale: "Normale",
  forte: "Forte",
  danger: "Danger",
};

const CLASSES_URGENCE: Record<Urgence, string> = {
  normale: "s-blue",
  forte: "s-warn",
  danger: "s-bad",
};

export function FicheEquipement({ id }: { id: string }) {
  const router = useRouter();
  const [persona] = useState<Persona | null>(personaInitial);
  const equipement = EQUIPEMENTS.find((e) => e.id === id) ?? null;
  const [incidents, setIncidents] = useState<Incident[]>(() => chargerIncidents(id));
  const [type, setType] = useState("");
  const [categorie, setCategorie] = useState("");
  const [constat, setConstat] = useState("");
  const [photo, setPhoto] = useState("");
  const [urgence, setUrgence] = useState<Urgence | "">("");
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!persona) router.replace("/");
  }, [persona, router]);

  if (!persona) return null;

  function changerDeRole() {
    window.localStorage.removeItem("persona-id");
    router.push("/");
  }

  if (!equipement) {
    return (
      <>
        <EnTete persona={persona} onChangerDeRole={changerDeRole} />
        <main className={styles.wrap}>
          <p>Équipement introuvable.</p>
        </main>
      </>
    );
  }

  const enDanger = aUnIncidentDanger(incidents);
  const etat = enDanger ? ETATS.bad : ETATS[equipement.etat];

  function envoyer(e: FormEvent) {
    e.preventDefault();
    const manquants = champsManquants({ type, categorie, constat, photo, urgence });
    if (manquants.length > 0) {
      setErreur(`Merci de renseigner : ${manquants.join(", ")}.`);
      return;
    }
    const incident = ajouterIncident(id, { type, categorie, constat, photo, urgence }, persona!.nom);
    setIncidents((prev) => [incident, ...prev]);
    setType("");
    setCategorie("");
    setConstat("");
    setPhoto("");
    setUrgence("");
    setErreur(null);
  }

  return (
    <>
      <EnTete persona={persona} onChangerDeRole={changerDeRole} />
      <main className={styles.wrap}>
        <div>
          <h1>{equipement.terrain}</h1>
          <div className={styles.sub}>
            {equipement.ville} · {equipement.type} · <span className={`st ${etat.classe}`}>{etat.libelle}</span>
          </div>
        </div>

        <section className="card">
          <form className={styles.form} onSubmit={envoyer}>
            <h2>Signaler un incident</h2>
            <label>
              Type
              <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Ex. Filet déchiré" />
            </label>
            <label>
              Catégorie
              <input value={categorie} onChange={(e) => setCategorie(e.target.value)} placeholder="Ex. Usure" />
            </label>
            <label>
              Constat
              <textarea value={constat} onChange={(e) => setConstat(e.target.value)} placeholder="Décrivez ce que vous observez" />
            </label>
            <label>
              Photo
              <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Nom du fichier photo" />
            </label>
            <label>
              Urgence
              <select value={urgence} onChange={(e) => setUrgence(e.target.value as Urgence)}>
                <option value="">Choisir…</option>
                <option value="normale">Normale</option>
                <option value="forte">Forte</option>
                <option value="danger">Danger</option>
              </select>
            </label>
            {erreur && <p className={styles.erreur}>{erreur}</p>}
            <button type="submit" className="btn pri">
              Envoyer le signalement
            </button>
          </form>
        </section>

        <section className="card">
          <div className={styles.secH}>
            <h2>Incidents signalés</h2>
            <span className={styles.count}>{incidents.length}</span>
          </div>
          <div className={styles.liste}>
            {incidents.length === 0 && <p className={styles.vide}>Aucun incident signalé pour l&rsquo;instant.</p>}
            {incidents.map((i) => (
              <div className="row" key={i.id}>
                <span>
                  <span className={styles.t}>
                    {i.type} · {i.categorie}
                  </span>
                  <br />
                  <span className={styles.m}>
                    {new Date(i.date).toLocaleString("fr-FR")} · {i.auteur} · {i.photo}
                  </span>
                  <br />
                  <span className={styles.m}>{i.constat}</span>
                </span>
                <span className={styles.r}>
                  <span className={`st ${CLASSES_URGENCE[i.urgence]}`}>{LIBELLES_URGENCE[i.urgence]}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
