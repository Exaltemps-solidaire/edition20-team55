"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EQUIPEMENTS } from "@/lib/equipements";
import { chargerTousIncidents, trierParGraviteEtDate, type Incident } from "@/lib/incidents";
import { trouverPersona, type Persona } from "@/lib/personas";
import styles from "./Bannettes.module.css";

type Props = {
  persona: Persona;
  version: number;
};

const POINT: Record<Incident["urgence"], string> = { danger: styles.bad, forte: styles.warn, normale: styles.blue };

function equipementDe(incident: Incident) {
  return EQUIPEMENTS.find((e) => e.id === incident.equipementId) ?? null;
}

function anciennete(date: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  return `il y a ${Math.round(minutes / 60)} h`;
}

export function Bannettes({ persona, version }: Props) {
  const [onglet, setOnglet] = useState<"moi" | "commune">("moi");

  // version force le recalcul au retour du réseau, quand les incidents en attente repassent « nouveau »
  const { maBannette, commune, notifications } = useMemo(() => {
    const ouverts = chargerTousIncidents().filter((i) => i.statut === "nouveau" || i.statut === "en_attente");
    const commune = trierParGraviteEtDate(ouverts);
    const maBannette = trierParGraviteEtDate(ouverts.filter((i) => i.attribueA === persona.id));
    const notifications = maBannette.filter((i) => i.statut === "nouveau");
    return { maBannette, commune, notifications };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- version ne sert qu'à forcer la relecture du localStorage au retour réseau
  }, [persona.id, version]);

  const liste = onglet === "moi" ? maBannette : commune;

  return (
    <section className="card">
      {notifications.length > 0 && (
        <div className={styles.notifs}>
          {notifications.map((i) => {
            const equipement = equipementDe(i);
            return (
              <div className={styles.notif} key={`notif-${i.id}`}>
                <div className={styles.notifLigne}>
                  <span className="st s-blue">Teams · canal Infra {equipement?.ville ?? ""}</span>
                  <span className={styles.notifRegle}>règle {i.regleAppliquee}</span>
                </div>
                {i.urgence === "danger" && (
                  <div className={styles.notifLigne}>
                    <span className="st s-bad">Mail immédiat</span>
                  </div>
                )}
                <p className={styles.notifTexte}>
                  {equipement?.terrain ?? i.equipementId} · {i.type} — {i.constat}
                </p>
                <Link className="btn sec" href={`/equipement/${i.equipementId}`}>
                  Ouvrir le carnet
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.tabs}>
        <button type="button" className={`${styles.tab} ${onglet === "moi" ? styles.actif : ""}`} onClick={() => setOnglet("moi")}>
          Ma bannette <span className={styles.compteur}>{maBannette.length}</span>
        </button>
        <button type="button" className={`${styles.tab} ${onglet === "commune" ? styles.actif : ""}`} onClick={() => setOnglet("commune")}>
          Commune <span className={styles.compteur}>{commune.length}</span>
        </button>
      </div>

      <div className={styles.liste}>
        {liste.length === 0 && <p className={styles.vide}>Aucun incident ouvert pour l&rsquo;instant.</p>}
        {liste.map((i) => {
          const equipement = equipementDe(i);
          const nomAttribue = i.attribueA === persona.id ? "Vous" : (trouverPersona(i.attribueA)?.nom ?? i.attribueA);
          return (
            <Link className="row" href={`/equipement/${i.equipementId}`} key={i.id}>
              <span className={`${styles.pt} ${POINT[i.urgence]}`} />
              <span>
                <span className={styles.t}>
                  {equipement?.terrain ?? i.equipementId} · {equipement?.ville ?? ""}
                </span>
                <br />
                <span className={styles.m}>
                  {i.constat} · {anciennete(i.date)}
                </span>
              </span>
              <span className={styles.r}>
                <span className={styles.m}>{nomAttribue}</span>
                <span className="st s-grey">À prendre</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
