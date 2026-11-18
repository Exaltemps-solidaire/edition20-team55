"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnTete } from "@/components/EnTete";
import { trouverPersona, type Persona } from "@/lib/personas";
import { EQUIPEMENTS, ETATS } from "@/lib/equipements";
import {
  ajouterIncident,
  champsManquants,
  chargerIncidents,
  etatDerive,
  marquerReparee,
  prendreEnCharge,
  renvoyerEnAttente,
  type Incident,
  type Urgence,
} from "@/lib/incidents";
import { ajouterIntervention, champsManquantsIntervention, priseEnChargeProposee, type SaisieIntervention } from "@/lib/interventions";
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
  const champPhoto = useRef<HTMLInputElement>(null);
  const [incidentEnIntervention, setIncidentEnIntervention] = useState<string | null>(null);
  const [saisieIntervention, setSaisieIntervention] = useState<SaisieIntervention>({ prestataire: "", date: "", priseEnCharge: "", photoReparation: "" });
  const [erreurIntervention, setErreurIntervention] = useState<string | null>(null);
  const [messageTeams, setMessageTeams] = useState<string | null>(null);

  function choisirPhoto(e: ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) {
      setPhoto("");
      return;
    }
    const lecteur = new FileReader();
    lecteur.onload = () => setPhoto(typeof lecteur.result === "string" ? lecteur.result : "");
    lecteur.readAsDataURL(fichier);
  }

  useEffect(() => {
    if (!persona) router.replace("/");
  }, [persona, router]);

  useEffect(() => {
    function auRetourDuReseau() {
      setIncidents(renvoyerEnAttente(id));
    }
    window.addEventListener("online", auRetourDuReseau);
    return () => window.removeEventListener("online", auRetourDuReseau);
  }, [id]);

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

  const derive = etatDerive(incidents);
  const etat = derive ? ETATS[derive] : ETATS[equipement.etat];

  function envoyer(e: FormEvent) {
    e.preventDefault();
    const manquants = champsManquants({ type, categorie, constat, photo, urgence });
    if (manquants.length > 0) {
      setErreur(`Merci de renseigner : ${manquants.join(", ")}.`);
      return;
    }
    const incident = ajouterIncident(equipement!, { type, categorie, constat, photo, urgence }, persona!.nom, navigator.onLine);
    setIncidents((prev) => [incident, ...prev]);
    setType("");
    setCategorie("");
    setConstat("");
    setPhoto("");
    setUrgence("");
    setErreur(null);
    if (champPhoto.current) champPhoto.current.value = "";
  }

  function marquerPrisEnCharge(incidentId: string) {
    setIncidents(prendreEnCharge(id, incidentId));
  }

  function ouvrirIntervention(incidentId: string) {
    setIncidentEnIntervention(incidentId);
    setSaisieIntervention({ prestataire: "", date: "", priseEnCharge: priseEnChargeProposee(equipement!), photoReparation: "" });
    setErreurIntervention(null);
  }

  function choisirPhotoReparation(e: ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) {
      setSaisieIntervention((s) => ({ ...s, photoReparation: "" }));
      return;
    }
    const lecteur = new FileReader();
    lecteur.onload = () => setSaisieIntervention((s) => ({ ...s, photoReparation: typeof lecteur.result === "string" ? lecteur.result : "" }));
    lecteur.readAsDataURL(fichier);
  }

  function validerIntervention(incidentId: string) {
    const manquants = champsManquantsIntervention(saisieIntervention);
    if (manquants.length > 0) {
      setErreurIntervention(`Merci de renseigner : ${manquants.join(", ")}.`);
      return;
    }
    ajouterIntervention(equipement!, incidentId, saisieIntervention);
    setIncidents(marquerReparee(id, incidentId));
    setMessageTeams("Teams, conversation avec le RST du terrain : demande de vérification envoyée.");
    setIncidentEnIntervention(null);
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
              <input type="file" accept="image/*" ref={champPhoto} onChange={choisirPhoto} />
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
          {messageTeams && (
            <div className={styles.liste}>
              <p className="st s-blue">{messageTeams}</p>
            </div>
          )}
          <div className={styles.liste}>
            {incidents.length === 0 && <p className={styles.vide}>Aucun incident signalé pour l&rsquo;instant.</p>}
            {incidents.map((i) => (
              <div key={i.id}>
                <div className="row">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data URL locale, pas une ressource à optimiser */}
                  <img className={styles.photo} src={i.photo} alt="" />
                  <span>
                    <span className={styles.t}>
                      {i.type} · {i.categorie}
                    </span>
                    <br />
                    <span className={styles.m}>
                      {new Date(i.date).toLocaleString("fr-FR")} · {i.auteur}
                    </span>
                    <br />
                    <span className={styles.m}>{i.constat}</span>
                  </span>
                  <span className={styles.r}>
                    {i.statut === "en_attente" && <span className="st s-grey">En attente d&rsquo;envoi</span>}
                    <span className={`st ${CLASSES_URGENCE[i.urgence]}`}>{LIBELLES_URGENCE[i.urgence]}</span>
                    {i.etape === "reparee" ? (
                      <span className="st s-blue">Réparé, à vérifier</span>
                    ) : i.prisEnCharge ? (
                      <>
                        <span className="st s-ok">Pris en charge</span>
                        <button type="button" className="btn sec" onClick={() => ouvrirIntervention(i.id)}>
                          Enregistrer l&rsquo;intervention
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn sec" onClick={() => marquerPrisEnCharge(i.id)}>
                        Prendre en charge
                      </button>
                    )}
                  </span>
                </div>
                {incidentEnIntervention === i.id && (
                  <div className={styles.form}>
                    <label>
                      Prestataire
                      <input
                        value={saisieIntervention.prestataire}
                        onChange={(e) => setSaisieIntervention((s) => ({ ...s, prestataire: e.target.value }))}
                        placeholder="Ex. Menuiserie Dupont"
                      />
                    </label>
                    <label>
                      Date
                      <input
                        type="date"
                        value={saisieIntervention.date}
                        onChange={(e) => setSaisieIntervention((s) => ({ ...s, date: e.target.value }))}
                      />
                    </label>
                    <label>
                      Prise en charge
                      <select
                        value={saisieIntervention.priseEnCharge}
                        onChange={(e) => setSaisieIntervention((s) => ({ ...s, priseEnCharge: e.target.value }))}
                      >
                        <option value="Ville">Ville</option>
                        <option value="Association">Association</option>
                      </select>
                    </label>
                    <label>
                      Photo de la réparation
                      <input type="file" accept="image/*" onChange={choisirPhotoReparation} />
                    </label>
                    {erreurIntervention && <p className={styles.erreur}>{erreurIntervention}</p>}
                    <button type="button" className="btn pri" onClick={() => validerIntervention(i.id)}>
                      Marquer réparé, à vérifier
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
