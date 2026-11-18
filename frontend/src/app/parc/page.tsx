"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EnTete } from "@/components/EnTete";
import { Bannettes } from "@/components/Bannettes";
import { trouverPersona, type Persona } from "@/lib/personas";
import { EQUIPEMENTS, ETATS } from "@/lib/equipements";
import { chargerIncidents, etatDerive, renvoyerTousEnAttente } from "@/lib/incidents";
import styles from "./page.module.css";

function personaInitial(): Persona | null {
  if (typeof window === "undefined") return null;
  return trouverPersona(window.localStorage.getItem("persona-id"));
}

function etatDeriveInitial(): Record<string, "bad" | "reparation" | null> {
  const etats: Record<string, "bad" | "reparation" | null> = {};
  for (const e of EQUIPEMENTS) {
    etats[e.id] = etatDerive(chargerIncidents(e.id));
  }
  return etats;
}

export default function Parc() {
  const router = useRouter();
  const [persona] = useState<Persona | null>(personaInitial);
  const [etatParEquipement, setEtatParEquipement] = useState<Record<string, "bad" | "reparation" | null>>(etatDeriveInitial);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!persona) router.replace("/");
  }, [persona, router]);

  useEffect(() => {
    function auRetourDuReseau() {
      renvoyerTousEnAttente();
      setEtatParEquipement(etatDeriveInitial());
      setVersion((v) => v + 1);
    }
    window.addEventListener("online", auRetourDuReseau);
    return () => window.removeEventListener("online", auRetourDuReseau);
  }, []);

  function changerDeRole() {
    window.localStorage.removeItem("persona-id");
    router.push("/");
  }

  if (!persona) return null;

  return (
    <>
      <EnTete persona={persona} onChangerDeRole={changerDeRole} />
      <main className={styles.wrap}>
        <div>
          <h1>Où devons-nous agir ?</h1>
          <div className={styles.sub}>
            80 terrains, 5 régions, jeu de données fictif.
          </div>
        </div>
        <Bannettes persona={persona} version={version} />
        <section className="card">
          <div className={styles.secH}>
            <h2>Équipements</h2>
            <span className={styles.count}>{EQUIPEMENTS.length}</span>
          </div>
          <div className={styles.liste}>
            {EQUIPEMENTS.map((e) => {
              const derive = etatParEquipement[e.id];
              const etat = derive ? ETATS[derive] : ETATS[e.etat];
              return (
                <Link className="row" href={`/equipement/${e.id}`} key={e.id}>
                  <span className={styles.ic}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 12h4l3-8 4 16 3-8h4" />
                    </svg>
                  </span>
                  <span>
                    <span className={styles.t}>{e.terrain}</span>
                    <br />
                    <span className={styles.m}>
                      {e.ville} · {e.type}
                    </span>
                  </span>
                  <span className={styles.r}>
                    <span className={`st ${etat.classe}`}>{etat.libelle}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
