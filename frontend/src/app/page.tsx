"use client";

import { useRouter } from "next/navigation";
import { EnTete } from "@/components/EnTete";
import { PERSONAS } from "@/lib/personas";
import styles from "./page.module.css";

export default function QuiEtesVous() {
  const router = useRouter();

  function choisir(id: string) {
    window.localStorage.setItem("persona-id", id);
    router.push("/parc");
  }

  return (
    <>
      <EnTete />
      <div className={styles.wrap}>
        <section className={`card ${styles.panel}`}>
          <h1>Qui êtes-vous ?</h1>
          <p className={styles.sub}>
            Choisissez un profil pour continuer. Vous pourrez en changer à tout moment.
          </p>
          <div className={styles.liste}>
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                className={`row ${styles.persona}`}
                onClick={() => choisir(p.id)}
              >
                <span className={styles.avatar}>{p.nom.charAt(0)}</span>
                <span>
                  <span className={styles.nom}>{p.nom}</span>
                  <br />
                  <span className={styles.role}>{p.libelleRole}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
